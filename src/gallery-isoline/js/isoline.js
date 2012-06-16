/**
 * @module gallery-isoline
 */
(function (Y, moduleName) {
    'use strict';
    
    var _Array = Array,
        _Shape = Y.Shape,
    
        _ceil = Math.ceil,
        _max = Math.max,
        _min = Math.min,
        _isUndefined = Y.Lang.isUndefined,
        _parseInt = parseInt,
        
        _class = function () {
            _class.superclass.constructor.apply(this, arguments);
        };
    
    Y.Isoline = Y.extend(_class, _Shape, {
        _draw: function () {
            var me = this,
            
                dataCellHeight = me.get('dataCellHeight') || 1,
                dataCellWidth = me.get('dataCellWidth') || 1,
                
                halfDataCellHeight = dataCellHeight / 2,
                halfDataCellWidth = dataCellWidth / 2,
                
                height = me.get('height'),
                width = me.get('width'),
                
                dataFn = me.get('dataFn'),
                
                dataMaxX = _min(me.get('dataMaxX') || width, width),
                dataMaxY = _min(me.get('dataMaxY') || height, height),
                
                dataMinX = _max(me.get('dataMinX') || 0, 0),
                dataMinY = _max(me.get('dataMinY') || 0, 0),
                
                dataCellCountX = _ceil((dataMaxX - dataMinX) / dataCellWidth),
                dataCellCountY = _ceil((dataMaxY - dataMinY) / dataCellHeight),
                
                dataPointCountX = dataCellCountX + 1,
                
                dataCells = _Array(dataCellCountX * dataCellCountY),
                dataPoints = _Array(dataPointCountX * (dataCellCountY + 1)),
                
                dataCellX,
                dataCellY = 0;
            
            me.clear();
            
            for (; dataCellY < dataCellCountY; dataCellY += 1) {
                for (dataCellX = 0; dataCellX < dataCellCountX; dataCellX += 1) {
                    me._drawFromCell(dataCellX, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX);
                }
            }
        },
        _drawFromCell: function (dataCellX, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, from, startDataCellX, startDataCellY, continued) {
            var dataCellIndex = dataCellX + dataCellY * dataCellCountX,
                dataCellValue = dataCells[dataCellIndex],
                
                dataPointIndex,
                dataPointValue,
                
                me = this,
                
                splitDataCellValue,
                
                x,
                y;

            if (dataCellValue === true) {
                return;
            }

            if (_isUndefined(dataCellValue)) {
                dataCellValue = '';

                x = dataMinX + dataCellX * dataCellWidth;
                y = dataMinY + dataCellY * dataCellHeight;

                dataPointIndex = dataCellX + dataCellY * dataPointCountX;
                dataPointValue = dataPoints[dataPointIndex];

                if (_isUndefined(dataPointValue)) {
                    dataPointValue = dataFn(x - halfDataCellWidth, y - halfDataCellHeight) ? 1 : 0;
                    dataPoints[dataPointIndex] = dataPointValue;
                }

                dataCellValue += dataPointValue;

                dataPointIndex = dataCellX + 1 + dataCellY * dataPointCountX;
                dataPointValue = dataPoints[dataPointIndex];

                if (_isUndefined(dataPointValue)) {
                    dataPointValue = dataFn(x + halfDataCellWidth, y - halfDataCellHeight) ? 1 : 0;
                    dataPoints[dataPointIndex] = dataPointValue;
                }

                dataCellValue += dataPointValue;

                dataPointIndex = dataCellX + 1 + (dataCellY + 1) * dataPointCountX;
                dataPointValue = dataPoints[dataPointIndex];

                if (_isUndefined(dataPointValue)) {
                    dataPointValue = dataFn(x + halfDataCellWidth, y + halfDataCellHeight) ? 1 : 0;
                    dataPoints[dataPointIndex] = dataPointValue;
                }

                dataCellValue += dataPointValue;

                dataPointIndex = dataCellX + (dataCellY + 1) * dataPointCountX;
                dataPointValue = dataPoints[dataPointIndex];

                if (_isUndefined(dataPointValue)) {
                    dataPointValue = dataFn(x - halfDataCellWidth, y + halfDataCellHeight) ? 1 : 0;
                    dataPoints[dataPointIndex] = dataPointValue;
                }

                dataCellValue += dataPointValue;

                dataCellValue = _parseInt(dataCellValue, 2);

                if (dataCellValue === 5) {
                    splitDataCellValue = true;
                    
                    if (!dataFn(x, y)) {
                        if (from >= 2 || from <= 5) {
                            dataCellValue = 4;
                        } else if (from >= 8 && from <= 11) {
                            dataCellValue = 1;
                        }
                    }
                } else if (dataCellValue === 10) {
                    splitDataCellValue = true;
                    
                    if (!dataFn(x, y)) {
                        if (from === 1 || from === 2 || from === 11 || from === 12) {
                            dataCellValue = 8;
                        } else if (from >= 5 && from <= 8) {
                            dataCellValue = 2;
                        }
                    }
                }
                
                dataCells[dataCellIndex] = dataCellValue;
            }
            
            if (!continued) {
                startDataCellX = dataCellX;
                startDataCellY = dataCellY;
            }

            
            switch (dataCellValue) {
                case 1:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 9) {
                            me.lineTo(x, y + halfDataCellHeight);
                        } else if (from === 10) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 9) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 8) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.end();
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        dataCells[dataCellIndex] = 4;
                        return;
                    }
                    
                    break;
                case 2:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 6) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 7) {
                            me.lineTo(x, y + halfDataCellHeight);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5
                    } else if (from === 7) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    }
                    
                    if (from === 5) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.end();
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        dataCells[dataCellIndex] = 8;
                        return;
                    }
                    
                    break;
                case 3:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 7 && from !== 9) {
                        if (from === 6) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 10) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 5) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 7) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y);
                            me.lineTo(x + halfDataCellWidth, y);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 9) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y);
                            me.lineTo(x - halfDataCellWidth, y);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
                case 4:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 3) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 4) {
                            me.lineTo(x + halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 3) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 10) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.end();
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        dataCells[dataCellIndex] = 1;
                        return;
                    }
                    
                    break;
                case 5:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 3) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 4) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 9) {
                            me.lineTo(x, y + halfDataCellHeight);
                        } else if (from === 10) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 3) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    } else if (from === 9) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y + halfDataCellHeight);
                                me.lineTo(x + halfDataCellWidth, y);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellY - 1 >= 0) {
                                        me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.lineTo(x, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellWidth);
                                    
                                    if (dataCellX + 1 < dataCellCountX) {
                                        me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x + halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 > dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.lineTo(x - halfDataCellWidth, y);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellWidth);
                                    
                                    if (dataCellY + 1 < dataCellCountY) {
                                        me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.lintTo(x, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                    
                                    if (dataCellX - 1 >= 0) {
                                        me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x - halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        return;
                    }
                    
                    break;
                case 6:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 4 && from !== 6) {
                        if (from === 3) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 7) {
                            me.lineTo(x, y + halfDataCellHeight);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 3) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 7) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y + halfDataCellHeight);
                            me.lineTo(x, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y - halfDataCellHeight);
                            me.lineTo(x, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
                case 7:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 4 && from !== 6 && from !== 7 && from !== 9) {
                        if (from === 3) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 10) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 3) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellY - 1 >= 0) {
                                        me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.lineTo(x, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y - halfDataCellHeight);
                            me.lineTo(x - halfDataCellWidth, y);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 7) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 9) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.lineTo(x - halfDataCellWidth, y);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                    
                                    if (dataCellX - 1 >= 0) {
                                        me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x - halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    }
                    
                    break;
                case 8:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 1) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 12) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 1) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.end();
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        dataCells[dataCellIndex] = 2;
                        return;
                    }
                    
                    break;
                case 9:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 10 && from !== 12) {
                        if (from === 1) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 9) {
                            me.lineTo(x, y + halfDataCellHeight);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 1) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 9) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y - halfDataCellHeight);
                            me.lineTo(x, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y + halfDataCellHeight);
                            me.lineTo(x, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    }
                    
                    break;
                case 10:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY) {
                        if (from === 1) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 6) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 7) {
                            me.lineTo(x, y + halfDataCellHeight);
                        } else if (from === 12) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 1) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    } else if (from === 7) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.lineTo(x - halfDataCellWidth, y);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellY - 1 >= 0) {
                                        me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.lineTo(x, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    
                                    if (dataCellX + 1 < dataCellCountX) {
                                        me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x + halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.lineTo(x + halfDataCellWidth, y);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    
                                    if (dataCellY + 1 <= dataCellCountY) {
                                        me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.lintTo(x, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellX - 1 >= 0) {
                                        me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x - halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    }
                    
                    if (splitDataCellValue) {
                        return;
                    }
                    
                    break;
                case 11:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 7 && from !== 9 && from !== 10 && from !== 12) {
                        if (from === 1) {
                            me.lineTo(x, y - halfDataCellHeight);
                        } else if (from === 6) {
                            me.lineTo(x + halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y - halfDataCellHeight);
                        from = 2;
                    } else if (from === 1) {
                        me.lineTo(x, y - halfDataCellHeight);
                        from = 2
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    }
                    
                    if (from === 2) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellY - 1 >= 0) {
                                        me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y - halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                    
                                    if (dataCellX + 1 < dataCellCountX) {
                                        me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x + halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 7) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y - halfDataCellHeight);
                                me.lineTo(x + halfDataCellWidth, y);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 9) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y);
                            me.lineTo(x, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y - halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.lineTo(x, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 8, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
                case 12:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 1 && from !== 3) {
                        if (from === 4) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 12) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y);
                        from = 11;
                    }
                    
                    if (from === 1) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y);
                            me.lineTo(x - halfDataCellWidth, y);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 3) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y);
                            me.lineTo(x + halfDataCellWidth, y);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                me.end();
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
                case 13:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 1 && from !== 3 && from !== 10 && from !== 12) {
                        if (from === 4) {
                            me.lineTo(x + halfDataCellWidth, y);
                        } else if (from === 9) {
                            me.lineTo(x, y + halfDataCellHeight);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y);
                        from = 5;
                    } else if (from === 9) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    }
                    
                    if (from === 1) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y);
                            me.lineTo(x, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 3) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y + halfDataCellHeight);
                                me.lineTo(x + halfDataCellWidth, y);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 5) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellX + 1 < dataCellCountX) {
                                        me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x + halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x + halfDataCellWidth, y);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                    
                                    if (dataCellY + 1 < dataCellCountY) {
                                        me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y + halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y);
                                me.lineTo(x, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y + halfDataCellHeight);
                            me.lineTo(x + halfDataCellWidth, y);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 11, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
                case 14:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from !== 1 && from !== 3 && from !== 4 && from !== 6) {
                        if (from === 7) {
                            me.lineTo(x, y + halfDataCellHeight);
                        } else if (from === 12) {
                            me.lineTo(x - halfDataCellWidth, y);
                        }
                        
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y);
                        from = 11;
                    } else if (from === 7) {
                        me.lineTo(x, y + halfDataCellHeight);
                        from = 8;
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y)
                        from = 11;
                    }
                    
                    if (from === 1) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x, y + halfDataCellHeight);
                                me.lineTo(x - halfDataCellWidth, y);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 3) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y);
                            me.lineTo(x, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x, y + halfDataCellHeight);
                            me.lineTo(x - halfDataCellWidth, y);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y);
                                me.lineTo(x, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellWidth);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 8) {
                        me.lineTo(x - halfDataCellWidth, y);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 5, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                    
                                    if (dataCellY + 1 < dataCellCountY) {
                                        me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x, y + halfDataCellHeight);
                                        me.end();
                                    }
                                }
                            }
                        }
                    } else if (from === 11) {
                        me.lineTo(x, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 2, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    
                                    if (dataCellX - 1 >= 0) {
                                        me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                    } else {
                                        me.lineTo(x - halfDataCellWidth, y);
                                        me.end();
                                    }
                                }
                            }
                        }
                    }
                    
                    break;
                case 15:
                    if (continued && dataCellX === startDataCellX && dataCellY === startDataCellY && from === 10) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        me.end();
                        return;
                    }
                    
                    if (!from) {
                        me.moveTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        from = 1;
                    }
                    
                    if (from === 1) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 3) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellY + 1 < dataCellCountY) {
                                me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 4) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 6) {
                        me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX - 1 >= 0) {
                                me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 7) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX - 1 >= 0) {
                            me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 7, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX + 1 < dataCellCountX) {
                                    me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 9) {
                        me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellX + 1 < dataCellCountX) {
                            me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellY - 1 >= 0) {
                                me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellX - 1 >= 0) {
                                    me._drawFromCell(dataCellX - 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 3, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 10) {
                        me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                        
                        if (dataCellY - 1 >= 0) {
                            me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 10, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 1, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                                
                                if (dataCellY + 1 < dataCellCountY) {
                                    me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 4, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    } else if (from === 12) {
                        me.lineTo(x - halfDataCellWidth, y + halfDataCellHeight);
                        
                        if (dataCellY + 1 < dataCellCountY) {
                            me._drawFromCell(dataCellX, dataCellY + 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 12, startDataCellX, startDataCellY, true);
                        } else {
                            me.lineTo(x + halfDataCellWidth, y + halfDataCellHeight);
                            
                            if (dataCellX + 1 < dataCellCountX) {
                                me._drawFromCell(dataCellX + 1, dataCellY, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 9, startDataCellX, startDataCellY, true);
                            } else {
                                me.lineTo(x + halfDataCellWidth, y - halfDataCellHeight);
                                
                                if (dataCellY - 1 >= 0) {
                                    me._drawFromCell(dataCellX, dataCellY - 1, dataCells, dataCellCountX, dataCellCountY, dataCellWidth, dataCellHeight, halfDataCellWidth, halfDataCellHeight, dataFn, dataMinX, dataMinY, dataPoints, dataPointCountX, 6, startDataCellX, startDataCellY, true);
                                } else {
                                    me.lineTo(x - halfDataCellWidth, y - halfDataCellHeight);
                                    me.end();
                                }
                            }
                        }
                    }
                    
                    break;
            }
            
            dataCells[dataCellIndex] = true;
        }
    }, {
        ATTRS: Y.mix({
            dataCellHeight: {
                value: 1
            },
            dataCellSize: {
                setter: function (dataCellSize) {
                    this._set('dataCellHeight', dataCellSize);
                    this._set('dataCellWidth', dataCellSize);
                    return dataCellSize;
                },
                value: 1
            },
            dataCellWidth: {
                value: 1
            },
            dataFn: {
                value: function () {
                    return false;
                }
            },
            dataMaxX: {
                value: null
            },
            dataMaxY: {
                value: null
            },
            dataMinX: {
                value: null
            },
            dataMinY: {
                value: null
            }
        }, _Shape.ATTRS)
    });
}(Y, arguments[1]));