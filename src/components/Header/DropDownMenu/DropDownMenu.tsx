import React, {FC, useEffect, useState} from 'react';
import styles from "./DropDownMenu.module.css";
import DropItem from "./DropItem.tsx";
import {useSelector} from "react-redux";
import {DropMenuList} from "../BottomHeaderMenu/ElementList_DropDownMenu";

type myList_Type = {
    name: string,
    title: string,
    categories: myList_categories_Type[]
};
type myList_categories_Type = {
    name: string,
    link: string,
    type: string,
};
// type DropMenuSubItem_Types = {
//     name: string,
//     title: string,
//     categories: [],
// }
type DropMenuList_Types = {
    gender: string,
    typeOfCloth: myList_Type[],
}

const DropDownMenu: FC = () => {
    const {dropDownValue, gender} =  useSelector(({headerState}) => (headerState));
    const [myList, setMyList] = useState<myList_Type | []>([]);

    useEffect(() => {
        const actualGender: DropMenuList_Types = DropMenuList.find(el => el.gender === gender);
        const actualCategory: myList_Type  = actualGender.typeOfCloth.find(el => el.name === dropDownValue);
        setMyList(actualCategory);
    }, [dropDownValue, gender]);

    return (
        <div className={styles.mainDiv}>
            <div className={styles.subDiv}>
                {
                    myList?.categories?.map<myList_categories_Type[]>((el, index) =>
                        <div key={index}>
                            <DropItem el={el}/>
                            <br/>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default DropDownMenu;