import RenderCampsite from "../features/campsites/RenderCampsite";
import { FlatList, StyleSheet, Text, View, Button, Modal } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import { useState } from "react";
import { Rating } from "react-native-ratings";
import { Input } from "react-native-elements";
import { postComment } from "../features/comments/commentsSlice";

const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");

    const dispatch = useDispatch();

    const handleSubmit = () => {
        const newComment = {
            campsiteId: campsite.id,
            author,
            rating,
            text,
        };
        console.log(newComment);
        setShowModal(!showModal);
        dispatch(postComment(newComment));
    };

    const resetForm = () => {
        setRating(5);
        setAuthor("");
        setText("");
    };
    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating
                    isDisabled
                    style={{ alignItems: "flex-start", paddingVertical: "5%" }}
                    startingValue={item.rating}
                    imageSize={10}
                />
                <Text
                    style={{ fontSize: 12 }}
                >{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id,
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    marginHorizontal: 20,
                    paddingVertical: 20,
                }}
                ListHeaderComponent={
                    <>
                        <RenderCampsite
                            markFavorite={() =>
                                dispatch(toggleFavorite(campsite.id))
                            }
                            isFavorite={favorites.includes(campsite.id)}
                            campsite={campsite}
                            onShowModal={() => setShowModal(!showModal)}
                        />
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />
            <Modal
                animationType="slide"
                transparent={false}
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
            >
                <Input></Input>
                <View style={styles.modal}>
                    <Rating
                        startingValue={rating}
                        imageSize={40}
                        onFinishRating={(rating) => setRating(rating)}
                        style={{ paddingVertical: 10 }}
                        showRating
                    />
                    <Input
                        placeholder="Author"
                        leftIcon="user-o"
                        leftIconContainerStyle={{ paddingRight: 10 }}
                        onChangeText={(author) => setAuthor(author)}
                        value={author}
                    />
                    <Input
                        placeholder="Comment"
                        leftIcon="comment-o"
                        leftIconContainerStyle={{ paddingRight: 10 }}
                        onChangeText={(comment) => setText(comment)}
                        value={text}
                    />
                    <View style={{ margin: 10 }}>
                        <Button
                            title="Submit"
                            color="#5637DD"
                            onPress={() => {
                                handleSubmit();
                                resetForm();
                            }}
                        />
                    </View>
                    <View style={{ margin: 10 }}>
                        <Button
                            onPress={() => {
                                setShowModal(!showModal);
                                resetForm();
                            }}
                            style={{ color: "#808080" }}
                            title="Cancel"
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: "center",
        backgroundColor: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        color: "#43484d",
        padding: 10,
        paddingTop: 30,
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    modal: {
        justifyContent: "center",
        margin: 20,
    },
});

export default CampsiteInfoScreen;
