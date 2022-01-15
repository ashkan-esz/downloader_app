import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import PropTypes from 'prop-types';


const CustomAccordion = ({extraStyle, sections, expandedIndex, renderHeader, renderContent, flatListRef}) => {

    const keyExtractor = (item) =>
        (item.seasonNumber || '') +
        (item.episodeNumber || '') +
        (item.quality || '');

    const renderItem = ({item, index}) => (
        <View>
            {renderHeader(item, index)}
            {
                expandedIndex === index && renderContent(item)
            }
        </View>
    );

    return (
        <View style={extraStyle}>
            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                getItemLayout={(data, index) => (
                    {length: 45, offset: 45 * index, index}
                )}
            />
        </View>
    );
};

const style = StyleSheet.create({});

CustomAccordion.propTypes = {
    extraStyle: PropTypes.object,
    sections: PropTypes.array.isRequired,
    expandedIndex: PropTypes.number.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    flatListRef: PropTypes.object,
}


export default CustomAccordion;
