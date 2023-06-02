import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import styles from "./Search.module.css";
import SearchUI from "../../ui/SearchUI/SearchUI";
import {Cloth} from "../../db/clothes-db";
import {
    DropMenuList,
    linkType
} from "../../components/Header/HeaderLinks/ElementList_DropDownMenu";
import {clothesService} from "../../services/ClothesService";
import {Gender} from "../../redux/action-types";
import CategoryItem from "../Catalog/ListItem/CategoryItem";

export type genderValue_type = {
    name: "Для всіх" | "Для хлопців" | "Для дівчат",
    link: "all" | "male" | "female",
}

const Search = () => {

    const {genderOfLink, searchingValue} = useParams();
    const ClothesService = clothesService;

    const [onSetGenderActive, setOnSetGenderActive] = useState<boolean>(false);
    const [genderValue, setGenderValue] = useState<genderValue_type>({name: "Для всіх", link: "all"});
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [searchOptions, setSearchOptions] = useState<string[]>([]);

    const [actualMas, setActualMas] = useState<Cloth[] | undefined>([]);

    const setOnSearching = () => {
    };


    useEffect(() => {
        findSearchResults();
    }, [genderOfLink, searchingValue]);

    useEffect(() => {
        const lower = searchOptions?.map(el => el.toLowerCase());
        const result = lower?.filter(el => el.includes(searchValue.toLowerCase()));
        setSearchResults(result);
    }, [searchValue]);


    function findSearchResults() {
        let uniqueMasOfTitles = [];
        let uniqueMasOfSubCategories = [];
        for (let i = 0; i < DropMenuList.length; i++) {
            for (let j = 0; j < DropMenuList[i].clothList.length; j++) {
                uniqueMasOfTitles.push(DropMenuList[i].clothList[j].title);
                for (let k = 0; k < DropMenuList[i].clothList[j].categories.length; k++) {
                    uniqueMasOfTitles.push(DropMenuList[i].clothList[j].categories[k].name);
                    uniqueMasOfSubCategories.push(DropMenuList[i].clothList[j].categories[k]);
                }
            }
        }
        uniqueMasOfTitles = uniqueMasOfTitles.filter((x, i, a) => a.indexOf(x) === i);
        // uniqueMasOfTitles = uniqueMasOfTitles.map(el => el.replace("_", " "));
        uniqueMasOfTitles = uniqueMasOfTitles.map(el => el.replace("\n", "").replace("-", " ").replace(",", "").replace("_", " "));
        // uniqueMasOfTitles = uniqueMasOfTitles.map(el => el
        //     .split("_").join(" ")
        //     .split("\n").join(" ")
        //     .split("-").join(" "));
        setSearchOptions(uniqueMasOfTitles);

        uniqueMasOfSubCategories = uniqueMasOfSubCategories.filter(el => el.name.toLowerCase().includes(searchValue.toLowerCase()));
        let linkMas: linkType[] = uniqueMasOfSubCategories.map(el => el.link);
        linkMas = linkMas.filter((x, i, a) => a.indexOf(x) === i);

        const masBySubCategories = linkMas.map(el => ClothesService.getClothesByCategory(el, genderOfLink as Gender || "all"));
        uniqueMasOfSubCategories = masBySubCategories.map((item) => item)
            .filter((name, index, currentVal) => currentVal.indexOf(name) === index);

        let byName = ClothesService.getClothesByGenderAndSearchWorld(genderOfLink as Gender || "all", searchingValue as string);
        let bySubCategory = [];
        for (let i = 0; i < uniqueMasOfSubCategories.length; i++) {
            for (let j = 0; j < uniqueMasOfSubCategories[i].length; j++) {
                bySubCategory.push(uniqueMasOfSubCategories[i][j]);
            }
        }
        let searchResults = [...bySubCategory, ...byName];
        searchResults = searchResults
            .filter((name, index, currentVal) => currentVal.indexOf(name) === index);
        searchResults = searchResults
            .sort(function (a, b) {
                return b.id - a.id;
            })

        if (searchingValue === "all") {
            let allElements = ClothesService.getAllByGender(genderOfLink as Gender | "all");
            allElements &&
            setActualMas(allElements);
        } else {
            setActualMas(searchResults);
        }
    }


    return (
        <div className={styles.main}>
            <div className={styles.contentBlock}>

                <div className={styles.resultsLabel}>РЕЗУЛЬТАТИ ПОШУКУ</div>

                <SearchUI
                    setOnSetGenderActive={setOnSetGenderActive}
                    setGenderValue={setGenderValue}
                    setSearchValue={setSearchValue}
                    setSearchResults={setSearchResults}
                    // setSearchOptions={setSearchOptions}
                    onSetGenderActive={onSetGenderActive}
                    genderValue={genderValue}
                    searchValue={searchValue}
                    searchResults={searchResults}
                    // searchOptions={searchOptions}
                    setOnSearching={setOnSearching}
                    styles={styles}
                    // findSearchResults={findSearchResults}
                />

                <div className={styles.list}>
                    {
                        actualMas?.map(el => <CategoryItem key={el.id} item={el}/>)
                    }
                </div>
            </div>
        </div>

    );
};

export default Search;