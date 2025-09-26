export const demandConfig = {
    title: "Demand",
    config: {

        // //>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Transmission Demand


        // // Transmission actual
        "EL_ITSD": { type: "area", color: "#4682B4", visible: true, buttonName: 'T-Act' },
        "EL_ROLLING": { type: "line", color: "#08b4f8", visible: true, buttonName: 'T-Rolling' },
        "EL_ROLLING_AVG": { type: "line", color: "#83d9fb", visible: false, buttonName: 'T-Rolling Avg' },

        // // Transmission forecast 
        // // #626684
        "EL_TSDF_latest": { type: "spline", color: "#414458", visible: true, buttonName: 'latest' },
        "EL_TSDF_00:00": { type: "spline", color: "#4c4f67", visible: false, dashStyle: 'dot', buttonName: '00:00' },
        "EL_TSDF_04:00": { type: "spline", color: "#575b75", visible: false, dashStyle: 'Dash', buttonName: '04:00' },
        "EL_TSDF_08:00": { type: "spline", color: "#626684", visible: false, dashStyle: 'LongDash', buttonName: '08:00' },
        "EL_TSDF_12:00": { type: "spline", color: "#6d7193", visible: false, dashStyle: 'LongDashDotDot', buttonName: '12:00' },
        "EL_TSDF_16:00": { type: "spline", color: "#7c809d", visible: false, dashStyle: 'ShortDash', buttonName: '16:00' },
        "EL_TSDF_20:00": { type: "spline", color: "#8a8ea8", visible: false, dashStyle: 'ShortDashDot', buttonName: '20:00' },

        // // #f193a1
        "EN_TSDF_latest": { type: "line", color: "#f2ab68", visible: true, buttonName: 'latest' },
        "EN_TSDF_00:00": { type: "line", color: "#e7b415", visible: false, dashStyle: 'dot', buttonName: '00:00' },
        "EN_TSDF_04:00": { type: "line", color: "#eec441", visible: false, dashStyle: 'Dash', buttonName: '04:00' },
        "EN_TSDF_08:00": { type: "line", color: "#f0cb58", visible: false, dashStyle: 'LongDash', buttonName: '08:00' },
        "EN_TSDF_12:00": { type: "line", color: "#f2d26f", visible: false, dashStyle: 'LongDashDotDot', buttonName: '12:00' },
        "EN_TSDF_16:00": { type: "line", color: "#f0cb58", visible: false, dashStyle: 'ShortDash', buttonName: '16:00' },
        "EN_TSDF_20:00": { type: "line", color: "#f1d068", visible: false, dashStyle: 'ShortDashDot', buttonName: '20:00' },

        // // Transmission DA

        "EN_TSDF_DA": { type: "line", color: "#f05153", visible: false, dashStyle: 'Dash', buttonName: 'T-DA (En)' },
        "EL_TSD_DA": { type: "line", color: "#024b95", visible: false, dashStyle: 'Dash', buttonName: 'T-DA (NG)' },




        // // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> National Demand


        // // National actual
        "EL_IDO": { type: "area", color: "#d6be9f", visible: false, buttonName: 'N-Act' },


        // // National forecast
        // // #9065b5
        "EL_IND_latest": { type: "spline", color: "#a98c4f", visible: false, buttonName: 'latest' },
        "EL_IND_00:00": { type: "spline", color: "#b4985d", visible: false, dashStyle: 'dot', buttonName: '00:00' },
        "EL_IND_04:00": { type: "spline", color: "#bca36f", visible: false, dashStyle: 'Dash', buttonName: '04:00' },
        "EL_IND_08:00": { type: "spline", color: "#c4ae80", visible: false, dashStyle: 'LongDash', buttonName: '08:00' },
        "EL_IND_12:00": { type: "spline", color: "#ccb991", visible: false, dashStyle: 'LongDashDotDot', buttonName: '12:00' },
        "EL_IND_16:00": { type: "spline", color: "#d4c4a3", visible: false, dashStyle: 'ShortDash', buttonName: '16:00' },
        "EL_IND_20:00": { type: "spline", color: "#dccfb4", visible: false, dashStyle: 'ShortDashDot', buttonName: '20:00' },




        // // National DA

        "EL_IND_DA": { type: "line", color: "#97c93d", visible: false, dashStyle: 'Dash', buttonName: 'N-DA (NG)' },


    },
}