YUI.add('gallery-sqlplus', function(Y) {

/**
 * This module provides an interface to an Oracle database from Node.js.
 * It requires Oracle's SQL*Plus application to be installed.
 * This module runs SQL*Plus as a child process and communicates through stdin and stdout.
 * @module gallery-sqlplus
 */

(function (Y) {
    'use strict';
    
    var _lang = Y.Lang,
        
        _readTableData,
        _trim = _lang.trim,
        _write,
    
        _class;
        
    /**
     * @class SqlPlus
     * @constructor
     * @extends Base
     * @param {Object} config Configuration object.
     */
    _class = function (config) {
        _class.superclass.constructor.call(this, config);
    };
    
    _class.ATTRS = {
        /**
         * Array of command line arguments, excluding database connection information.
         * This class expects to receive HTML output from SQL*Plus.  The default args enable HTML output mode in SQL*Plus.
         * When setting custom args, be sure to enable HTML output mode.
         * @attribute args
         * @default ['-MARKUP', 'HTML ON']
         * @initOnly
         * @type Array
         */
        args: {
            value: [
                '-MARKUP',
                'HTML ON'
            ],
            writeOnce: 'initOnly'
        },
        /**
         * The sqlplus command.  If SQL*Plus is installed and in the system path, the default value should work fine.
         * @attribute command
         * @default 'sqlplus'
         * @initOnly
         * @type String
         */
        command: {
            value: 'sqlplus',
            writeOnce: 'initOnly'
        },
        /**
         * Database conntection information.
         * If the value is a String, it should be in the following format: 'user/password@host/database'
         * If the value is an Object it should have the following properties: database, host, password, user
         * Try connecting to a database with SQL*Plus on the command line to figure out exactly what values need to be entered here.
         * @attribute connection
         * @initOnly
         * @type String
         */
        connection: {
            setter: function (connection) {
                if (_lang.isObject(connection)) {
                    return connection.user + '/' + connection.password + '@' + connection.host + '/' + connection.database;
                }
                
                return connection;
            },
            writeOnce: 'initOnly'
        },
        /**
         * This class directly reads and writes from the SQL*Plus shell.
         * It will look for this prompt value to know it's ready to send another command.
         * When SQL*Plus is in HTML output mode, characters in the prompt will be HTML encoded.
         * @attribute prompt
         * @default 'SQL&gt; '
         * @type String
         */
        prompt: {
            value: 'SQL&gt; '
        },
        /**
         * This will be true when the stdin of the SQL*Plus process is writable, its kernel buffer is not full,
         * and the prompt string has been read from the stdout of the SQL*Plus pocess.
         * @attribute ready
         * @default false
         * @readOnly
         * @type Boolean
         */
        ready: {
            readOnly: true,
            value: false
        },
        /**
         * This is the SQL*Plus child process object.
         * @attribute sqlPlus
         * @readOnly
         * @type ChildProcess
         */
        sqlPlus: {
            readOnly: true
        }
    };
    
    _class.NAME = 'SqlPlus';
    
    Y.extend(_class, Y.Base, {
        /**
         * Executes a query on the database.  This is a convenience wrapper around the write method.
         * If the stdout of the SQL*Plus process is currently returning data from a previous query,
         * the query will be queued until the prompt string is read.
         * If the stdin of the SQL*Plus process has reported its kernel buffer is full, the query will be queued until the drain event.
         * Note that SQL*Plus by default does not auto commit queries individual.  SQL*Plus will perform a commit when it is terminated properly.
         * @method execute
         * @chainable
         * @param {String} query The query string to execute.  Note that SQL*Plus requires queries to end with a ';'.
         * Warning: If the ';' is missing, the query will be sent to the SQL*Plus shell, then the shell will detect that the query is
         * incomplete and it will wait for more input.  This class currently does not handle the waiting for more imput state.
         * Forgetting the ';' will break the communication between this class and the SQL*Plus process.
         * Warning: This method accepts the query string as is and passes it to SQL*Plus.  There are no prepared statements, no data binding,
         * and no checks to make sure values are properly escaped and quoted.  There are no safeguards here against sql injection attacks.
         * Warning: There are certain characters which may be unexpectedly interpreted incorrectly by SQL*Plus.  See comments on the write method.
         * @param {Function} callbackFunction A function which receives two arguments:
         * <dl>
         *     <dt>
         *         error
         *     </dt>
         *     <dd>
         *         The error string returned by SQL*Plus or null.  If an error is returned, data will be null.
         *     </dd>
         *     <dt>
         *         data
         *     </dt>
         *     <dd>
         *         <ul>
         *             <li>
         *                 A SELECT query will return an array of objects.  There will be one object per row of data returned.
         *                 The array may be empty.  Each object will have the same property.  The property names will be complete strings of
         *                 the column names returned by SQL*Plus.  For example the query, "SELECT count(*) FROM users;" will
         *                 return an array with one object.  That object will have one property called 'COUNT(*)'.  In cases of complex names
         *                 I recommend renaming the columns like this, "SELECT count(*) AS count FROM users;".  For Oracle number column types,
         *                 the values returned should be numbers or null.  For Oracle text column types, the values returned should be strings
         *                 or null.  Oracle date and time column types get converted to text; I recommend using the PL/SQL TO_CHAR function to
         *                 manually specify the date and time formats that are returned.  Oracle clob values appear to be selectable just like
         *                 other text values except they may get truncated to 2000000000 characters.  All returned string values will have
         *                 leading and trailing whitespace trimmed.  Other column types have not been tested.  Complex column types could
         *                 probably be made to work, but have not been implemented.
         *             </li>
         *             <li>
         *                 A DELETE, INSERT, or UPDATE statemet query will return the number rows affected by the query.
         *             </li>
         *             <li>
         *                 Other types of queries have not been tested and aren't supported by the execute method.  Refer to the write method
         *                 for more information.
         *             </li>
         *     </dd>
         * </dl>
         * @param {Object} contextObject (optional) An object to provide as the execution context for the callback function.
         */
        execute: function (query, callbackFunction, contextObject) {
            return this.write(query + '\n', function (responseNode) {
                // Received a Node object from the write method.
                //
                // SQL*Plus spits out several extra prompts and <br>s in the midst of its output.
                // There's probably a SQL*Plus setting to fix this.  For now, search and replace them.
                // 
                // The prompt value contains HTML encoded characters so the prompt can easily be found from stdout.
                // Strings from text nodes get HTML decoded.  To find the extra prompts, the prompt value must be HTML decoded.
                //
                // The best way to HTML decode a string is to create a text node and read it back out.  Seriously?
                responseNode.append('<span id="prompt">' + this.get('prompt') + '</span>');
                
                var node = responseNode.one('#prompt'),
                    prompt;
                
                if (node) {
                    prompt = node.remove().get('text');
                }
               
                // If there was an error, SQL*Plus returns part of it in a pre element so it can use spaces to identify the position of the error.
                // Otherwise HTML renderers would collapse all of the consecutive whitespace.
                node = responseNode.one('pre');
                
                if (node) {
                    // There was a pre element so remove the extra prompts, breaks, and whitespace.  Return the error text.
                    callbackFunction.call(contextObject, _trim(prompt && responseNode.get('text').replace(new RegExp(prompt, 'g'), '') || responseNode.get('text')));
                    return;
                }
                
                // SELECT results are returned in a table element.
                node = responseNode.one('table');
                
                if (node) {
                    // SELECT results table found.  Reading the table values gets messy, so the code is in another function.
                    _readTableData(node, callbackFunction, contextObject);
                    return;
                }
                
                // If a SELECT query fails to return any rows, the text 'no rows selected' is returned.
                if (responseNode.get('text').indexOf('no rows selected') === -1) {
                    // Since there was no table element and the text 'no rows selected' was not returned, this was not a SELECT query.
                    // SQL*Plus should have returned text saying something like '5 rows updated'.  Remove the extra prompts, breaks, and
                    // whitespace, then parseInt should be able to grab that leading integer value.
                    callbackFunction.call(contextObject, null, parseInt(_trim(prompt && responseNode.get('text').replace(new RegExp(prompt, 'g'), '') || responseNode.get('text')), 10));
                    return;
                }
                
                // No rows were selected.  Return an empty array.
                callbackFunction.call(contextObject, null, []);
            }, this);
        },
        initializer: function () {
            /**
             * Fires when the SQL*Plus process exits.  Note that SQL*Plus provides a shell interface and does not terminate by itself.
             * While a Sql*Plus process is running, the parent process will not terminate by itself either.  To terminate the SQL*Plus process,
             * pass 'exit\n' or 'quit\n' to the write method, or call the kill method on the sqlPlus attribute Child Process object.
             * @event exit
             * @param {Number|null} code If the SQL*Plus process terminated normally, code is the final exit code, otherwise null.
             * @param {String|null} signal If the SQL*Plus process terminated due to receipt of a signal,
             * signal is the string name of the signal, otherwise null.
             * @preventable destroy
             */
            this.publish('exit', {
                defaultFn: function () {
                    this.destroy();
                },
                fireOnce: true
            });
            
            /**
             * Fires when a complete response has been received from SQL*Plus.  This is not the indended way to receive responses from SQL*Plus
             * queries sent throught the execute or write methods.  Use the callback function arguments of those methods to get the response.
             * Preventing this event will prevent callback functions associated with this specific response from being called.
             * @event response
             * @param {String} data
             * @preventable
             */
            this.publish('response');
            
            var response = '',
                sqlPlus = new Y.ChildProcess({
                    args: this.get('args').concat(this.get('connection')),
                    command: this.get('command'),
                    stderrEncoding: 'utf8',
                    stdoutEncoding: 'utf8'
                });
            
            sqlPlus.on('exit', function (eventFacade) {
                this.fire('exit', {
                    code: eventFacade.code,
                    signal: eventFacade.signal
                });
            }, this);
            
            sqlPlus.on('stdout', function (eventFacade) {
                var data = eventFacade.data,
                    prompt = this.get('prompt'),
                    promptSlice = -prompt.length;
                
                // Use this log statement to see the raw output of SQL*Plus.
                //Y.log(data, 'stdout', 'sqlplus');
                
                // A response doesn't always come all at once.  Keep appending to the response until it's finished.
                response += data;
                
                if (data.slice(promptSlice) === prompt) {
                    // The response is complete since we've received the prompt.
                    // The prompt wasn't part of the response; remove it.
                    response = response.slice(0, promptSlice);
                    
                    if (response) {
                        this.fire('response', {
                            data: response
                        });
                        
                        // Reset for the next response.
                        response = '';
                    }
                    
                    this._set('ready', true);
                }
            }, this);
            
            
            this._set('sqlPlus', sqlPlus);
            
            // SQL*Plus by default annoying takes special actions when it encounters the '&' character.  Turn that feature off.
            this.write('SET DEFINE OFF\n');
            // SQL*Plus has the concepts of reports and pages.  Every response from a command is a report.  Reports may be split into multiple
            // pages.  A page has a specific width and height.  When SQL*Plus is in its default output mode and the report spans multiple pages,
            // the output appeared to be unintellegable.  After browsing the documentation and changing some settings, I wasn't able to get
            // useable reports; the data was always garbled.  After switching to HTML output mode the reports improved dramatically.  There are
            // still these record page settings which affect the output of SELECT queries.
            //
            // LONG sets the maximum length of a line in the report.  Lines which exceed this length get truncated.  For most cases this isn't an
            // issue, but clob values which don't contain line beak characters may exceed this length.  2000000000 is the maximum value supported.
            this.write('SET LONG 2000000000\n');
            // SELECT queries return a table element with the selected data.  The first tr element in the table contains th elements containing
            // the column names.  If the number of rows returned is greater than PAGESIZE, more tr elements containing th elements of column
            // names is inserted into the table as a separator between pages.  PAGESIZE is set here to it's maximum value of 50000 to reduce the
            // occurrances of column name rows since they are only required once.
            this.write('SET PAGESIZE 50000\n');
        },
        /**
         * Sends data to the SQL*Plus shell.
         * If the stdout of the SQL*Plus process is currently returning data from a previous command,
         * this data will be queued until the prompt string is read.
         * If the stdin of the SQL*Plus process has reported its kernel buffer is full, this data will be queued until the drain event.
         * Note that SQL*Plus shell requires 'pressing enter' to execute a command.  Append a '\n' character to all commands for this to work.
         * Warning: If the '\n' is missing, the data will be sent to the SQL*Plus shell, then the shell will continue waiting for input until
         * 'enter is pressed'.  While the shell is waiting, the callback function will never fire.  The write method can continue to be invoked.
         * Each call to write will append more data to the shell until '\n' is received.  When the shell responds to the command, all callback
         * functions associated with this command will fire.
         * Warning: I'm not sure what will happen if '\n' occurs in the middle of a command.
         * @method write
         * @chainable
         * @param {Buffer|String} data The data to write.
         * @param {Function} callbackFunction (optional) A function that receives one argument, the response as a Node object.
         * @param {Object} contextObject (optional) An object to provide as the execution context for the callback function.
         */
        write: function (data, callbackFunction, contextObject) {
            if (this.get('ready')) {
                _write.call(this, data, callbackFunction, contextObject);
            } else {
                var eventHandle = this.after('readyChange', function (eventFacade) {
                    if (eventFacade.newVal) {
                        this.write(data, callbackFunction, contextObject);
                        eventHandle.detach();
                    }
                }, this);
            }
            
            return this;
        }
    });
    
    /**
     * @method _readTableData
     * @param {Node} tableNode
     * @param {Function} callbackFunction
     * @param {Object} contextObject
     * @private
     */
    _readTableData = function (tableNode, callbackFunction, contextObject) {
        var fields = [],
            // The first row contains th elements with the column names.
            firstTrNode = tableNode.one('tr:first-child').remove(),
            // Look at the second row to determine if each column is a number or string.
            // This is a work around because DataSchema XML doesn't provide access to element attributes from the parser.
            secondTrNode = tableNode.one('tr:first-child'),
            tdNodes = secondTrNode && secondTrNode.all('td');

        // If there are more than 50000 rows, the column names are repeated.  Remove them.
        tableNode.all('th').remove();
        tableNode.all('tr:empty').remove();

        // Loop through the column names.
        Y.each(firstTrNode.all('th'), function (thNode, index) {
            var tdNode = tdNodes && tdNodes.item(index);
            
            fields.push({
                key: _trim(thNode.get('text')),
                locator: 'td[' + (index + 1) + ']',
                parser: function (value) {
                    value = _trim(value);
                    
                    // SQL*Plus returns &nbsp; for all null values.
                    // If the column actually contains the text '&nbsp;' it will return null :(
                    if (value === '&nbsp;') {
                        return null;
                    }
                    
                    // For all number types, SQL*Plus adds an attribute align="right" to the td element.  Weird.
                    if (tdNode && tdNode.hasAttribute('align')) {
                        return +value;
                    } else {
                        return value;
                    }
                }
            });
        });

        // Y.DataSchema.XML does the heavy lifting of pulling the values out of the table.
        callbackFunction.call(contextObject, null, Y.DataSchema.XML.apply({
            resultFields: fields,
            resultListLocator: 'tr'
        }, tableNode.getDOMNode()).results);
    };
    
    /**
     * @method _write
     * @param {Buffer|String} data
     * @param {Function} callbackFunction
     * @param {Object} contextObject
     * @private
     */
    _write = function (data, callbackFunction, contextObject) {
        this.get('sqlPlus').write(data);
        this._set('ready', false);
        
        if (!callbackFunction) {
            return;
        }
        
        this.onceAfter('response', function (eventFacade) {
            // Y.Node.create doesn't seem to be supported in Node.js
            // A completely new dom needs to be created.
            YUI().use('node', 'nodejs-dom', 'selector-css3', function (Y) {
                // Insert content into the dom and return it.
                callbackFunction.call(contextObject, Y.one('body').setContent(eventFacade.data));
            });
        });
    };
    
    Y.SqlPlus = _class;
}(Y));


}, '@VERSION@' ,{requires:['dataschema-xml', 'gallery-child-process'], skinnable:false});
