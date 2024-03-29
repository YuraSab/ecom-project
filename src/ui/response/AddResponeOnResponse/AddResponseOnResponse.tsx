import React, {FC, useEffect, useState} from 'react';
import styles from "./AddResponseOnResponse.module.css";
import {useTypedSelector} from "../../../hooks/redux/useTypedSelector";
import {ResponseLike, Response} from "../../../redux/action-types";
import {useAction} from "../../../hooks/redux/useAction";
import ResponseItemUI from "../ResponseItem/ResponseItemUI";
import ResponseOnResponseItemUI from "../ResponseItem/ResponseOnResponseItemUI";

type AddResponseOnResponse_Props = {
    item: Response;
    setResponseOnResponseActive: (value: boolean) => void;
    handleAddResponseLike: () => void;
    actualResponseLikes: ResponseLike[];
}

const AddResponseOnResponse: FC<AddResponseOnResponse_Props> = ({item, handleAddResponseLike, actualResponseLikes, setResponseOnResponseActive}) => {

    const {parent_child_comments, responses} = useTypedSelector(state => state.responseReducer);
    const {onAddParentChildResponse, onAddResponse} = useAction();

    const [areaText, setAreaText] = useState<any>("");
    const [actualResponses, setActualResponses] = useState<Response[]>([]);

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return (() => {
            document.body.style.overflowY = 'auto';
        })
    }, [])

    useEffect(() => {
        const actualResponsesOnResponse = parent_child_comments.filter(el => el.id_parent_response === item.id_response);
        const filtered: Response[] = actualResponsesOnResponse.map(el => responses.find(item => item.id_response === el.id_child_response)) as Response[];
        setActualResponses(filtered);
    }, [responses]);

    const handleAddResponse = () => {
        if (areaText !== "") {
            onAddResponse({
                id_response: responses.length+1,
                id_user: 4,
                id_product: Number(item.id_product),
                text: areaText,
                date: new Date(),
                edited: false,
            });
            onAddParentChildResponse({
                id_parent_child_response: parent_child_comments.length+1,
                id_parent_response: item.id_response,
                id_child_response: responses.length+1,
            })
            setResponseOnResponseActive(false);
        }
    };


    return (
        <div className={styles.overlay} onClick={() => setResponseOnResponseActive(false)}>
            <div className={`${styles.mainDiv} ${styles.addResponseOnResponse}`} onClick={(event) => event.stopPropagation()}>
                <h3>Comment:{/*Коментар:*/}</h3>
                <ResponseItemUI
                    item={item}
                    actualResponses={actualResponses}
                    handleAddResponseLike={handleAddResponseLike}
                    actualResponseLikes={actualResponseLikes}
                    setResponseOnResponseActive={setResponseOnResponseActive}
                />
                <div className={styles.accountOrMediaCaption} style={{paddingTop: 40}}>Add answer{/*Додайте відгук*/}</div>
                <textarea
                    onChange={(e) => setAreaText(e.target.value)}
                    rows={5}
                    cols={8}
                    maxLength={400}
                >
                </textarea>
                <div className={styles.leftResponse} onClick={() => handleAddResponse()}>
                    {/*Залишити відповідь*/}
                    Save answer
                </div>
                {
                    actualResponses.length > 0 &&
                    <h3>Other answers{/*Інші відповіді:*/}</h3>
                }
                {
                    actualResponses.map(el => <ResponseOnResponseItemUI item={el} setResponseOnResponseActive={setResponseOnResponseActive}/>)
                }
            </div>
        </div>
    );
};

export default AddResponseOnResponse;