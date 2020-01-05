import React from 'react';
import { View, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import { Post } from '../types';
import constants from '../config/constants';
import { getLines } from '../lib/text';
import { colors, whitespace } from '../config/globalStyles';

import Svg, {
    Path,
    Rect,
    Text,
    TSpan
} from 'react-native-svg';

interface Props {
    displayWidthChars?: number;
    displayHeightChars?: number;
    currentPost?: Post;
}

interface State {
    screenDimensions?: ScreenDimensions;
}

interface ScreenDimensions {
    width: number;
    height: number;
}

interface GridDimensions {
    rowStart: number;
    columnStart: number;
    rowWidth: number;
    columnHeight: number;
    charWidth: number;
    charHeight: number;
}

export default class Display extends React.PureComponent<Props, State> {

    textKey: number = 0; // text won't rerender sometimes, This incrementing key makes sure it rerenders every time

    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    // grabs actual width/height of screen on render so that we can make the display fit the screen properly
    onLayout = (e: LayoutChangeEvent) => {
        if (this.state.screenDimensions === undefined) {
            const screenDimensions = {
                width: Math.round(e.nativeEvent.layout.width),
                height: Math.round(e.nativeEvent.layout.height)
            };
            this.setState({
                screenDimensions
            });
        }
    };

    getGridDimensions = (screenDimensions?: ScreenDimensions): GridDimensions | undefined => {
        const { displayWidthChars, displayHeightChars } = this.props;

        if (displayWidthChars === undefined || displayHeightChars === undefined || screenDimensions === undefined) {
            return undefined;
        }

        // find out if height or width is bounding the grid
        const charHeightWidthRatio = Platform.OS === 'ios' ?
            constants.CHAR_HEIGHT_WIDTH_RATIO_IOS : constants.CHAR_HEIGHT_WIDTH_RATIO_ANDROID;
        const viewHeightWidthRatio = screenDimensions.height / screenDimensions.width;
        const gridHeightWidthRatio = (displayHeightChars * charHeightWidthRatio) / displayWidthChars;
        const heightIsBounding = gridHeightWidthRatio > viewHeightWidthRatio;

        // generate grid position and dimensions based on whether height or width is bounding
        let charHeight;
        let charWidth;
        let rowStart;
        let columnStart;
        if (heightIsBounding === true) {
            charHeight = screenDimensions.height / displayHeightChars;
            charWidth = charHeight / charHeightWidthRatio;
            rowStart = Math.round((screenDimensions.width - charWidth * displayWidthChars) / 2);
            columnStart = 0;
        } else {
            charWidth = screenDimensions.width / displayWidthChars;
            charHeight = charWidth * charHeightWidthRatio;
            rowStart = 0;
            columnStart = Math.round((screenDimensions.height - charHeight * displayHeightChars) / 2);
        }

        const rowWidth = Math.round(charWidth * displayWidthChars);
        const columnHeight = Math.round(charHeight * displayHeightChars);

        return { rowStart, columnStart, rowWidth, columnHeight, charWidth, charHeight };
    }

    //commented out vertical grid because they don't always line up with letters since font sizes are integers
    getGridPath = (gridDimensions?: GridDimensions): string => {
        const { displayWidthChars, displayHeightChars } = this.props;

        if (displayWidthChars === undefined || displayHeightChars === undefined || gridDimensions === undefined) {
            return '';
        }

        const { rowStart, columnStart, rowWidth, charHeight } = gridDimensions;
        const steps: string[] = [];

        for (let i = 0; i <= displayHeightChars; i++) {
            steps.push('M' + rowStart.toString() + ' ' + Math.round(i * charHeight + columnStart).toString());
            steps.push('l' + rowWidth.toString() + ' 0');
        }
        // for (let i = 0; i <= displayWidthChars; i++) {
        //     steps.push('M' + Math.round(i * charWidth + rowStart).toString() + ' ' + columnStart.toString());
        //     steps.push('l0 ' + columnHeight.toString());
        // }

        return steps.join(' ');
    }

    //TODO: text rendering issues if we don't use the ever-incrementing text key. To solve this, I think the grid dimensions need
    // to be stored in the state. If the text directly relies on something in the state, it will rerender when the dimensions change.
    // The storing should be triggered by a layout change / getderivedstatefromprops I think
    getText = (gridDimensions?: GridDimensions) => {
        const { displayWidthChars, displayHeightChars } = this.props;

        if (displayWidthChars === undefined || displayHeightChars === undefined || gridDimensions === undefined) {
            return undefined;
        }

        const { rowStart, columnStart, charWidth, charHeight } = gridDimensions;

        const x = Math.round(rowStart + charWidth * 0.1);

        const fontSizeMultiplier = Platform.OS === 'ios' ?
            constants.FONT_SIZE_MULTIPLIER_IOS : constants.FONT_SIZE_MULTIPLIER_ANDROID;

        return (
            <Text
                fill={colors.appHighlightBlue}
                fontFamily ={Platform.OS === 'ios' ? 'Courier New' : 'monospace'}
                kerning='0'
                wordSpacing='0'
                fontSize={Math.round(charHeight * fontSizeMultiplier)}
                x={x}
                y={Math.round(columnStart + charHeight * 0.83)}
                key={this.textKey++}
            >
                {this.props.currentPost === undefined ?
                    undefined :
                    this.getTSpans(x, charHeight)}
            </Text>
        );
    }

    getTSpans = (x: number, dy: number) => {
        const { displayWidthChars, displayHeightChars, currentPost } = this.props;

        if (currentPost === undefined) {
            return undefined;
        }

        const lines = getLines(currentPost.text, displayHeightChars, displayWidthChars);
        return lines.map((line, idx) => <TSpan key={this.textKey++} x={x} dy={idx === 0 ? 0 : dy}>{line}</TSpan>);
    }

    getDisplay() {
        const { screenDimensions } = this.state;
        const { displayWidthChars, displayHeightChars } = this.props;

        if (displayWidthChars === undefined || displayHeightChars === undefined || displayWidthChars === 0 || displayHeightChars === 0) {
            return undefined;
        }

        const gridDimensions = this.getGridDimensions(screenDimensions);

        if (screenDimensions === undefined || gridDimensions === undefined) {
            return undefined;
        }

        return (
            <Svg
                width={screenDimensions.width}
                height={screenDimensions.height}
            >
                <Rect
                    x={gridDimensions.rowStart}
                    y={gridDimensions.columnStart}
                    width={gridDimensions.rowWidth}
                    height={gridDimensions.columnHeight}
                    fill={colors.appDarkBlue}
                />
                <Path
                    d={this.getGridPath(gridDimensions)}
                    fill='none'
                    stroke={colors.appLightBlue}
                    strokeWidth={2}
                />
                {this.getText(gridDimensions)}
            </Svg>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={styles.gridContainer}
                    onLayout={this.onLayout}
                >
                    {this.getDisplay()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        paddingLeft: whitespace.l,
        paddingRight: whitespace.l,
        paddingTop: whitespace.s,
        paddingBottom: whitespace.s,
        backgroundColor: colors.appBlack
    },
    gridContainer: {
        flex: 1
    }
});