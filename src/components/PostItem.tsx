import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, Platform } from 'react-native';
import CardSection from './CardSection';
import Button from './Button';
import Spinner from './Spinner';
import { colors, fontSizes, whitespace } from '../config/globalStyles';
import { Post } from '../types';
import moment from 'moment-timezone';
import { getLines } from '../lib/text';

const LARGE_LINE_WIDTH_THRESHHOLD = 30; // if displayWidthChars is >= this number, lines should have smaller text size

interface Props {
    post: Post;
    displayWidthChars?: number;
    displayHeightChars?: number;
    deletingPost: boolean;
    repostingPost: boolean;
    active: boolean;
    selected: boolean;
    timeZone: string;
    onPress(uuid: string): void;
    onPressDelete(uuid: string): void;
    onPressRepost(uuid: string): void;
}

export default class PostItem extends React.PureComponent<Props> {

    handlePress = () => {
        this.props.onPress(this.props.post.uuid);
    }

    handlePressDelete = () => {
        this.props.onPressDelete(this.props.post.uuid);
    }

    handlePressRepost = () => {
        this.props.onPressRepost(this.props.post.uuid);
    }

    renderButtons = () => {
        return (
            <View style={styles.buttonView}>
                {
                    this.props.deletingPost === true ?
                        <Spinner style={styles.spinner} /> :
                        <Button style={styles.button} onPress={this.handlePressDelete}>DELETE</Button>
                }
                {
                    this.props.repostingPost === true ?
                        <Spinner style={styles.spinner} /> :
                        <Button style={styles.button} onPress={this.handlePressRepost}>REPOST</Button>
                }
            </View>
        );
    }

    renderLines = () => {
        const { displayWidthChars, displayHeightChars, post } = this.props;
        const { text } = post;
        const lines: string[] = getLines(text, displayHeightChars, displayWidthChars);
        const largeLines = displayWidthChars === undefined ? true : displayWidthChars < LARGE_LINE_WIDTH_THRESHHOLD;
        return lines.map((line, idx) => {
            return (
                <Text style={largeLines === true ? styles.lineLarge : styles.lineSmall}
                    key={post.uuid + idx + 1}>{line.length === 0 ? ' ' : line}
                </Text>
            );
        });
    };

    render() {
        const { post, active, selected, timeZone } = this.props;
        const { timePosted } = post;
        const stamp = moment.tz(timePosted, timeZone).format('ddd MMM DD YYYY h:mm a z');

        return (
            <TouchableWithoutFeedback onPress={this.handlePress}>
                <View style={styles.container}>
                    <CardSection style={selected ? styles.postSelected : styles.postNormal}>
                        <View>
                            <Text style={active === true ? styles.dateActive : styles.dateNormal}>{stamp}</Text>
                            {this.renderLines()}
                        </View>
                        {selected === true ? this.renderButtons() : undefined}
                    </CardSection>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden'
    },
    buttonView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: whitespace.s,
        marginRight: whitespace.s,
        marginTop: whitespace.s
    },
    dateNormal: {
        paddingLeft: whitespace.s,
        fontSize: fontSizes.m,
        fontWeight: 'bold'
    },
    dateActive: {
        paddingLeft: whitespace.s,
        fontSize: fontSizes.m,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    lineSmall: {
        paddingLeft: whitespace.l,
        fontSize: fontSizes.xs,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace'
    },
    lineLarge: {
        paddingLeft: whitespace.l,
        fontSize: fontSizes.m,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace'
    },
    postSelected: {
        backgroundColor: colors.appLightGrey
    },
    postNormal: {
        backgroundColor: colors.appTransparent
    },
    spinner: {
        flex: 1
    },
    button: {
        flex: 1
    }
});