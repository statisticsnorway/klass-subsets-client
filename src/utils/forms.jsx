import { availableLanguages, disableUsed } from "./languages";
import React from "react";
import { PlusSquare, Trash2 } from "react-feather";
import "../css/langugeDropdown.css";

export const TextLanguageFieldset = ({
    title,
    items = [],
    size = { cols: 40, rows: 1 },
    prefix = "",
    handle = data => console.log(data),
    add = () => console.log("+"),
    remove = index => console.log("-", index)
}) => {
    const languages = availableLanguages();
    disableUsed(
        languages,
        items.map(name => name.languageCode)
    );

    const turnOfResizableTextArea = title === "Navn" ? "restrictResizing" : "";

    return (
        <div
            className='ssb-text-area addMarginBottom20'
            style={{ maxWidth: "350px", minWidth: "150px" }}
        >
            <label
                id={`textarea-label-${title}`}
                htmlFor={title}
                style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "5px"
                }}
            >
                {title}
            </label>

            {items.map((item, index) => (
                <div key={index} style={{ padding: "0 0 15px 0" }}>
                    <textarea
                        aria-labelledby={`textarea-label-${title}`}
                        className={
                            turnOfResizableTextArea ? "restrictResizing" : null
                        }
                        type='text'
                        cols={size.cols}
                        rows={size.rows}
                        style={{
                            display: "block",
                            width: "100%",
                            height: `${size.rows * 44}px`
                        }}
                        id={title}
                        value={item.languageText || prefix}
                        onChange={e =>
                            handle((item.languageText = e.target.value))
                        }
                        onKeyPress={e => {
                            e.which !== 0 &&
                                e.target.selectionStart < prefix.length &&
                                e.preventDefault();
                        }}
                        onKeyDown={e => {
                            ((e.which === 8 &&
                                e.target.selectionStart <= prefix.length) ||
                                (e.which === 46 &&
                                    e.target.selectionStart < prefix.length)) &&
                                e.preventDefault();
                        }}
                        onCut={e =>
                            e.target.selectionStart < prefix.length &&
                            e.preventDefault()
                        }
                        onPaste={e =>
                            e.target.selectionStart < prefix.length &&
                            e.preventDefault()
                        }
                    />

                    {/* É */}
                    <div
                        style={{
                            display: "inline-flex",
                            flexDirection: "row",
                            marginTop: "10px"
                        }}
                    >
                        <LanguageSelect
                            languages={languages}
                            selected={item.languageCode}
                            onChange={e =>
                                handle((item.languageCode = e.target.value))
                            }
                        />

                        <button
                            aria-label='Add language'
                            aria-disabled={
                                !(
                                    index === items.length - 1 &&
                                    index < languages.length - 1
                                )
                            }
                            disabled={
                                !(
                                    index === items.length - 1 &&
                                    index < languages.length - 1
                                )
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "none",
                                border: "none"
                            }}
                            onClick={() => add()}
                        >
                            <PlusSquare
                                color={
                                    index === items.length - 1 &&
                                    index < languages.length - 1
                                        ? "#1A9D49"
                                        : "#C3DCDC"
                                }
                            />
                        </button>

                        <button
                            aria-label='Remove language'
                            aria-disabled={index === 0}
                            disabled={index === 0}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "none",
                                border: "none"
                            }}
                            onClick={() => remove(index)}
                        >
                            <Trash2 color={index > 0 ? "#ED5935" : "#C3DCDC"} />
                        </button>
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <button aria-disabled='true' onClick={() => add()}>
                    <PlusSquare color='#1A9D49' />
                </button>
            )}
        </div>
    );
};

export const LanguageSelect = ({
    languages = availableLanguages(),
    selected = false,
    onChange = e => console.log(e.target.value)
}) => {
    return (
        <select
            aria-label='Language select'
            className='select-css'
            name='language'
            value={selected || languages.find(lang => lang.default)}
            onChange={e => onChange(e)}
        >
            {languages.map((lang, i) => (
                <option
                    key={i}
                    value={lang.languageCode}
                    disabled={lang.disabled}
                >
                    {lang.full}
                </option>
            ))}
        </select>
    );
};
