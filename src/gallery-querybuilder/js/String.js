/**********************************************************************
 * <p>Plugin for accepting a string or number.  In the <code>var_list</code>
 * configuration, specify <code>validation</code> to CSS classes that will
 * be interpreted by <code>Y.FormManager</code>.</p>
 * 
 * <p>All the operators specified for this plugin are displayed on a
 * menu.</p>
 * 
 * @module gallery-querybuilder
 * @class QueryBuilder.String
 * @constructor
 */

QueryBuilder.String = function(
	/* object */	query_builder,
	/* object */	config)
{
	this.qb = query_builder;

	this.op_menu_name_pattern   = config.field_prefix + 'query_op_{i}';
	this.val_input_name_pattern = config.field_prefix + 'query_val_{i}';
};

QueryBuilder.String.prototype =
{
	create: function(
		/* int */		query_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		var op_cell = this.qb._createContainer();
		op_cell.set('className', this.qb.getClassName('operator'));
		op_cell.set('innerHTML', this._operationsMenu(this.operationName(query_index)));
		this.op_menu = op_cell.one('select');

		var options = Y.Node.getDOMNode(this.op_menu).options;
		for (var i=0; i<op_list.length; i++)
		{
			options[i] = new Option(op_list[i].text, op_list[i].value);
		}

		value = value || ['',''];
		if (value[0])
		{
			this.op_menu.set('value', value[0]);
		}

		if (has_bubble_problem)
		{
			this.op_menu.on('change', this.qb._notifyChanged, this.qb);
		}

		var value_cell = this.qb._createContainer();
		value_cell.set('className', this.qb.getClassName('value'));
		value_cell.set('innerHTML', this._valueInput(this.valueName(query_index), var_config.validation));
		this.value_input = value_cell.one('input');
		this.value_input.set('value', value[1]);	// avoid formatting

		return [ op_cell, value_cell ];
	},

	postCreate: function(
		/* int */		filter_index,
		/* object */	var_config,
		/* array */		op_list,
		/* array */		value)
	{
		Y.Lang.later(1, this, function()	// hack for IE7
		{
			if (this.value_input)		// could be destroyed
			{
				try
				{
					this.value_input.focus();
				}
				catch (e)
				{
					// IE will complain if field is invisible, instead of just ignoring it
				}
			}
		});
	},

	destroy: function()
	{
		this.op_menu     = null;
		this.value_input = null;
	},

	updateName: function(
		/* int */	new_index)
	{
		this.op_menu.setAttribute('name', this.operationName(new_index));
		this.value_input.setAttribute('name', this.valueName(new_index));
	},

	set: function(
		/* int */	query_index,
		/* map */	data)
	{
		this.op_menu.set('value', data[ this.operationName(query_index) ]);
		this.value_input.set('value', data[ this.valueName(query_index) ]);
	},

	toDatabaseQuery: function()
	{
		return [ [ this.op_menu.get('value'), this.value_input.get('value') ] ];
	},

	/**********************************************************************
	 * Form element names.
	 */

	operationName: function(
		/* int */	i)
	{
		return Y.Lang.substitute(this.op_menu_name_pattern, {i:i});
	},

	valueName: function(
		/* int */	i)
	{
		return Y.Lang.substitute(this.val_input_name_pattern, {i:i});
	},

	//
	// Markup
	//

	_operationsMenu: function(
		/* string */	menu_name)
	{
		// This must use a select tag!

		var markup = '<select name="{n}" class="formmgr-field {c}" />';

		return Y.Lang.substitute(markup,
		{
			n: menu_name,
			c: this.qb.getClassName('field')
		});
	},

	_valueInput: function(
		/* string */	input_name,
		/* string */	validation_class)
	{
		// This must use an input tag!

		var markup = '<input type="text" name="{n}" class="yiv-required formmgr-field {c}"/>';

		return Y.Lang.substitute(markup,
		{
			n: input_name,
			c: validation_class + ' ' + this.qb.getClassName('field')
		});
	}
};
