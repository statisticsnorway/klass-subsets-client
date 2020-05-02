import React, { useState, useEffect } from "react";
import {
    Dropdown,
    Paragraph,
    Title,
} from "@statisticsnorway/ssb-component-library";
import { useTranslation } from "react-i18next";
import { useGet } from "../../controllers/subsets-service";
import { Subsets } from "../Subset";
import { Search } from "../../utils/Search";

export default function SearchSubsetsPage() {
    const { t } = useTranslation();
    const [subsets] = useGet("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => setSearchResults(subsets), [subsets]);

    return (
        <>
            <section className='search-subset-input mb-40 mt-40'>
                <Title size={2}>{t("Search subsets")}</Title>

                <Search
                    resource={subsets || []}
                    setChosen={(item) => setSearchResults(item)}
                    placeholder={t("Subset name")}
                    searchBy={(input, resource) =>
                        input === ""
                            ? subsets
                            : resource.filter(
                                  (i) =>
                                      i.name[0].languageText
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) > -1
                              )
                    }
                    searchible={(item) => item[0].languageText}
                />
            </section>
            <section>
                <Title size={3}>{t("Search results")}</Title>
                <Dropdown
                    className='search-subset-dropdown mb-40'
                    header={t("Sort by")}
                    selectedItem={{ title: t("Last updated"), id: "Last" }}
                    items={[
                        { title: t("Last updated"), id: "last" },
                        { title: t("Subset name"), id: "name" },
                        { title: t("Owner"), id: "owner" },
                        { title: t("Valid to"), id: "validto" },
                    ]}
                />

                {!searchResults || searchResults.length === 0 ? (
                    <Paragraph>{t("Nothing is found")}</Paragraph>
                ) : (
                    <Subsets
                        items={searchResults.sort((a, b) =>
                            a.lastUpdatedDate === b.lastUpdatedDate
                                ? 0
                                : a.lastUpdatedDate > b.lastUpdatedDate
                                ? -1
                                : 1
                        )}
                    />
                )}
            </section>
        </>
    );
}
