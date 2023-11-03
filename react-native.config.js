module.exports = {
    //todo : flash-list not compatible with fabric
    project: {
        ios: {
            unstable_reactLegacyComponentNames: [
                'CellContainer',
                'AutoLayoutView'
            ]
        },
        android: {
            unstable_reactLegacyComponentNames: [
                'CellContainer',
                'AutoLayoutView'
            ]
        },
    },
    assets: ['./src/assets/fonts'],
};