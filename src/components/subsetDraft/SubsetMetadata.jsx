import React, { useContext } from "react";
import "../../css/form.css";
import { Dropdown, TextLanguageFieldset } from "../../utils/forms";
import { AppContext } from "../../controllers/context";
import { languages, subsetDraft } from "../../controllers/defaults";
import { Title } from "@statisticsnorway/ssb-component-library";
import DatePicker from "react-date-picker";
import { useTranslation } from "react-i18next";

import ChangeDateModal from "../ChangeDateModal";
import useChangeDateModal from "../../utils/useChangeDateModal";
/*
 *  TODO: select components (2) from the ssb-component-library
 *  TODO: textarea styled as input text in the ssb-component-library
 *  FIXME: buttons Next-Previous have to be aligned properly
 *  FIXME: sanitize input
 */

export const SubsetMetadata = ({ subset }) => {
    subset.draft.name &&
        subset.draft.name.length < 1 &&
        subset.dispatch({ action: "name_add" });
    subset.draft.description?.length < 1 &&
        subset.dispatch({ action: "description_add" });
    const { ssbsections, classificationfamilies } = useContext(AppContext);
    const { t } = useTranslation();

    const { isShowing, dismiss, submit, handleDateChange } = useChangeDateModal();
    

    let isSameDate = false;

    const warnBeforeChangingDate = (date, toOrFrom) => {
        console.log(subset.draft.validFrom)
        
        if (toOrFrom === "from") {
            isSameDate = subset.draft.validFrom?.getTime() === date.getTime();
        }
        if (toOrFrom === "to") {
            isSameDate = subset.draft.validTo?.getTime() === date.getTime();
        }

        if (!isSameDate) {
            subset.dispatch({ action: "classification_remove_all_codes" });
        }

        subset.dispatch({ action: toOrFrom, data: date });
    };

    const showWarning = subset.draft.classifications;

    return (
        <>
            <Title size={3}>{t("Metadata")}</Title>
            <TextLanguageFieldset
                title={t("Names")}
                items={subset.draft.name}
                add={() => subset.dispatch({ action: "name_add" })}
                remove={index =>
                    subset.dispatch({ action: "name_remove", data: index })
                }
                handle={() => subset.dispatch({ action: "update" })}
                size={{ cols: 65, rows: 1 }}
                prefix={subsetDraft.namePrefix}
            />

            <section style={{ margin: "5px 0 5px 0" }}>
                <div
                    style={{ float: "left", marginRight: "20px", padding: "0" }}
                >
                    <label
                        style={{
                            display: "block",
                            fontSize: "16px",
                            fontFamily: "Roboto"
                        }}
                        htmlFor='from_date'
                    >
                        {t("Valid from")}:{" "}
                    </label>
                    <DatePicker
                        id='from_date'
                        style={{ display: "block" }}
                        value={subset.draft.validFrom}
                        onChange={date => handleDateChange(date, 'from')}
                        clearIcon={null}
                        format='dd.MM.y'
                        locale={languages.find(i => i.default).IETF}
                        className='datepicker'
                    />
                </div>

                <div style={{ float: "left" }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: "16px",
                            fontFamily: "Roboto"
                        }}
                        htmlFor='to_date'
                    >
                        {t("Valid to")}:{" "}
                    </label>
                    <DatePicker
                        id='to_date'
                        style={{ display: "block" }}
                        value={subset.draft.validUntil}
                        onChange={date => handleDateChange(date,'to')}
                        clearIcon={null}
                        format='dd.MM.y'
                        locale={languages.find(i => i.default).IETF}
                        className='datepicker'
                    />
                </div>
                <br style={{ clear: "both" }} />

                <ChangeDateModal isShowing={isShowing} submit={submit} dismiss={dismiss}/>
            </section>

            {/* TODO: set automatically when logged inn */}
            <Dropdown
                label={t("Owner")}
                options={ssbsections ? ssbsections._embedded.ssbSections : []}
                placeholder={t("Select a responsible department...")}
                selected={subset.draft.createdBy}
                onSelect={item =>
                    subset.dispatch({
                        action: "createdBy",
                        data: item
                    })
                }
            />

            {/* TODO: subject is stored in an array, it could be treated as tags ? */}
            <Dropdown
                label={t("Subject")}
                options={
                    classificationfamilies?._embedded.classificationFamilies ||
                    []
                }
                placeholder={t("Select a classification family...")}
                selected={
                    subset.draft.administrativeDetails.find(
                        d => d.administrativeDetailType === "ANNOTATION"
                    ).values[0] || ""
                }
                onSelect={item =>
                    subset.dispatch({
                        action: "subject",
                        data: item
                    })
                }
            />

            {/* FIXME: limit text size*/}
            <TextLanguageFieldset
                title={t("Description")}
                items={subset.draft.description}
                add={() => subset.dispatch({ action: "description_add" })}
                remove={index =>
                    subset.dispatch({
                        action: "description_remove",
                        data: index
                    })
                }
                handle={() => subset.dispatch({ action: "update" })}
                size={{ cols: 65, rows: 4 }}
            />

            {/* TODO: implement in next version
            <label><input type='checkbox'/>Subscribe for changes</label>
*/}

            {/* TODO: implement in next version if ordered
            /* move to each fieldset (?)
            <Button onClick={() => {subset.dispatch({action: 'reset'});}}>Reset</Button>
*/}
        </>
    );
};
