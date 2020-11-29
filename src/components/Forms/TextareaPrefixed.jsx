import React from 'react';
import keys from '../../utils/keys';

export const TextareaPrefixed = ({ id,
                                    value,
                                    cols = 40,
                                    rows = 1,
                                    onChange,
                                    prefix = '',
                                    maxLength
}) => {
    return (
        <textarea rows={ rows }
                  cols={ cols }
                  maxLength={ maxLength }
                  style={{ height: `${ rows * 44}px` }}
                  id={ id }
                  name={ id }
                  value={ value || prefix }
                  onChange={ onChange }
                  onKeyPress={(e) =>
                      e.which !== 0
                      && e.target.selectionStart < prefix.length
                      && e.preventDefault()
                  }
                  onKeyDown={(e) =>
                      ((e.which === keys.BACKSPACE && e.target.selectionStart <= prefix.length)
                          || (e.which === keys.DELETE && e.target.selectionStart < prefix.length))
                      && e.preventDefault()
                  }
                  onCut={(e) =>
                      e.target.selectionStart < prefix.length
                      && e.preventDefault()
                  }
                  onPaste={(e) =>
                      e.target.selectionStart < prefix.length
                      && e.preventDefault()
                  }
        />
    );
}