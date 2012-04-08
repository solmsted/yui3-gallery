/**
 * Make widget modality less scary.
 * @module gallery-widget-weak-modality
 */

(function (Y) {
    'use strict';
    
    var _some = Y.Array.some,
        _widgetModality = Y.WidgetModality,
        _widgetModalityStack = _widgetModality.STACK;
    
    /**
     * When set to a truthy value, a modal widget can be closed by clicking on
     * the background mask node.
     * @attribute weak
     * @default false
     * @for WidgetModality
     * @type Boolean
     */
    _widgetModality.ATTRS.weak = {
        value: false
    };
    
    Y.delegate('click', function () {
        _some(_widgetModalityStack, function (widget) {
            if (widget) {
                if (widget.get('weak')) {
                    widget.hide();
                }
                
                return true;
            }
            
            return false;
        });
    }, 'body', '.yui3-widget-mask');
}(Y));