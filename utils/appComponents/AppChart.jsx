"use client"

import React, { useEffect, useMemo, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// ----- Global Highcharts time config (UTC by default) -----
Highcharts.setOptions({
    time: { useUTC: true, timezone: "UTC" },
});

// ----- Lightweight pub/sub for cross-chart sync (hover/zoom) -----
const syncBus = (() => {
    const listeners = new Set();
    return {
        subscribe(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        publish(evt) {
            listeners.forEach((fn) => fn(evt));
        },
    };
})();

// ========================= Utilities ========================= //
const parseHeight = (height) => {
    if (typeof height === "number") return height;
    if (typeof height === "string") {
        const m = height.match(/(\d+(?:\.\d+)?)/);
        return m ? Number(m[1]) : 400;
    }
    return 400;
};


const zIndexForType = (t) => {
    const type = (t || "").toLowerCase();
    if (type === "line" || type === "spline") return 3;
    if (type === "column" || type === "bar") return 2;
    if (type === "area" || type === "areaspline") return 1;
    return 2; // sensible default above plotBands
};


const isEpochArray = (arr) =>
    Array.isArray(arr) && arr.length > 0 && arr.every((v) => /^\d+$/.test(String(v)));

const getSeriesCfg = (name, typeCfg) => {
    const key = typeCfg && (typeCfg[name] ? name : name.split(" ")[0]);
    const raw = typeCfg ? typeCfg[key] : undefined;

    if (typeof raw === "string") {
        return { type: raw, color: undefined, fillColor: undefined, visible: true, stack: undefined, dashStyle: undefined };
    }
    if (raw && typeof raw === "object") {
        let color = raw.color;
        let fillColor = raw.fillColor;
        // if color is a gradient and no explicit fillColor was given, use it as fill
        if (!fillColor && color && typeof color === "object" && color.stops) {
            fillColor = color;
            color = color.stops?.[0]?.[1] || "#999";
        }
        return {
            type: raw.type || "line",
            color,
            fillColor,
            visible: raw.visible !== false,
            stack: raw.stack,
            dashStyle: raw.dashStyle,
        };
    }
    return { type: "line", color: undefined, fillColor: undefined, visible: true, stack: undefined, dashStyle: undefined };
};

const hasStackedColumns = (typeCfg) =>
    Object.values(typeCfg || {}).some((cfg) => {
        const type = typeof cfg === "object" ? cfg?.type : cfg;
        const stack = typeof cfg === "object" ? cfg?.stack : undefined;
        return type === "column" && !!stack;
    });

const makeTooltipFormatter =
    ({ isEpoch, isDark, tooltipDesc, formatSeriesName }) =>
        function () {
            const settlementColor = isDark ? "#e2e8f0" : "#374151";
            const textColor = isDark ? "#f9fafb" : "#111827";
            const headerColor = isDark ? "#93c5fd" : "#2563eb";

            const header = isEpoch
                ? `<b>${Highcharts.dateFormat("%d-%m-%Y %H:%M", this.x)}</b>`
                : `<b>${this.x}</b>`;

            let pointIndex = this.points?.[0]?.point?.index;
            if (pointIndex == null && typeof this.point?.index === "number") {
                pointIndex = this.point.index;
            }

            const descVal =
                Array.isArray(tooltipDesc) &&
                    pointIndex != null &&
                    pointIndex >= 0 &&
                    pointIndex < tooltipDesc.length
                    ? tooltipDesc[pointIndex]
                    : null;

            const descLine =
                descVal != null
                    ? `<div style="padding:4px 12px;margin-top:2px;
                       font-size:12px;color:${settlementColor};
                       border-left:3px solid ${headerColor};
                       background:${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
                       border-radius:6px;">
               Settlement <span style="font-weight:600;font-size:15px;">${descVal}</span>
             </div>`
                    : "";

            const rows = (this.points || [])
                .filter((p) => p && p.y != null)
                .map((p) => {
                    const seriesName = formatSeriesName(p.series.name);
                    return `
            <div style="display:flex;justify-content:space-between;
                        align-items:center;padding:0px 12px;
                        font-size:13px;">
            <span style="font-weight:900;margin-right:12px;">
                <span style="color:${p.series.color};font-size:18px;vertical-align:middle;">●</span>
                <span style="color:${p.series.color};font-size:13px;vertical-align:middle;">${seriesName}</span>
            </span>



              <span style="font-weight:700;color:${textColor}">
                ${Highcharts.numberFormat(p.y, 0)}
              </span>
            </div>`;
                })
                .join("");


            return `
        <div style="
          backdrop-filter: blur(4px) saturate(160%);
          -webkit-backdrop-filter: blur(4px) saturate(160%);
          background: ${isDark
                    ? "rgba(17, 25, 40, 0.55)"   // darker but transparent
                    : "rgba(255, 255, 255, 0.55)"}; // lighter but transparent
          border: 1px solid ${isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.08)"};
          border-radius: 14px;
          padding: 6px 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          color: ${textColor};
          font-size: 13px;
          min-width: 160px;
          ">
          <div style="padding:6px 12px;margin-bottom:4px;
                      font-weight:700;color:${headerColor};
                      border-bottom:1px solid rgba(255,255,255,0.1)">
            ${header}
          </div>
          ${descLine}
          ${rows}
        </div>`;
        };




const buildXAxisPlotLine = ({ isEpoch, plotLinePoint, plotLineLabel, isDark, axisCategories, plotLineDashStyle }) => {
    if (plotLinePoint == null) return [];
    let value;

    if (isEpoch) {
        const secs = Number(plotLinePoint);
        if (!Number.isFinite(secs)) return [];
        value = secs * 1000; // ms for Highcharts datetime axis
    } else if (typeof plotLinePoint === "number" && Number.isInteger(plotLinePoint)) {
        value = plotLinePoint;
    } else if (typeof plotLinePoint === "string" && Array.isArray(axisCategories)) {
        const idx = axisCategories.indexOf(plotLinePoint);
        if (idx < 0) return [];
        value = idx;
    } else {
        return [];
    }

    return [
        {
            color: isDark ? "#00BFFF" : "#000000",
            width: 2,
            value,
            dashStyle: "Dash",
            zIndex: 4,
            label: {
                text: plotLineLabel,
                rotation: 0,
                y: 20,
                style: { fontSize: "14px", color: isDark ? "#00BFFF" : "#000000" },
            },
        },
    ];
};

const buildXAxisPlotBands = ({ isEpoch, xAxis, isDark, axisCategories, enable }) => {
    if (!enable) return [];

    // Categorical axis: alternate per category
    if (!isEpoch && Array.isArray(axisCategories)) {
        return axisCategories.map((_, index) => ({
            color: index % 2 !== 0 ? (isDark ? "#181828" : "#dfdcdc77") : (isDark ? "rgba(255, 255, 255, 0.02)" : "#f8f8f8"),
            from: index - 0.5,
            to: index + 0.5,
        }));
    }

    // Datetime axis: alternate intervals between consecutive points (guard last element)
    if (isEpoch && Array.isArray(xAxis) && xAxis.length > 1) {
        const bands = [];
        for (let i = 0; i < xAxis.length - 1; i++) {
            const t = xAxis[i] * 1000;
            const tNext = xAxis[i + 1] * 1000;
            const from = t + (tNext - t) / 2;
            const to = from + (tNext - t);
            bands.push({
                from,
                to,
                color: i % 2 !== 0 ? (isDark ? "#181828" : "#dfdcdc77") : (isDark ? "rgba(255, 255, 255, 0.02)" : "#f8f8f8"),
            });
        }
        return bands;
    }

    return [];
};

// ========================= Component ========================= //
function AppChart({
    title = "Chart",
    xAxis = [],
    chartData = {}, // { seriesName: number[] }
    chartTypeConfig = {}, // { seriesName: { type?, color?, visible?, stack?, dashStyle?, fillColor? } | string }
    width = "100%",
    height = "100vh",
    plotLinePoint, // epoch seconds OR category index OR category name
    plotLineLabel,
    isDark,
    plotBand = false,
    isGridLine = false,
    tooltipDesc,
    dashStyle: defaultSeriesDashStyle = "solid", // default for all series
    plotLineDashStyle = "solid", // default for the vertical plot line
    formatSeriesName
}) {
    const chartRef = useRef(null);
    const instanceIdRef = useRef(`chart_${Math.random().toString(36).slice(2)}`);

    const chartHeight = useMemo(() => parseHeight(height), [height]);
    const isEpoch = useMemo(() => isEpochArray(xAxis), [xAxis]);
    const stackedColumns = useMemo(() => hasStackedColumns(chartTypeConfig), [chartTypeConfig]);

    const series = useMemo(() => {
        const entries = Object.entries(chartData || {});
        if (!entries.length) return [];

        if (isEpoch) {
            const xms = xAxis.map((s) => Number(s) * 1000);
            return entries.map(([name, values = []]) => {
                const { type, color, fillColor, visible, stack, dashStyle } = getSeriesCfg(name, chartTypeConfig);
                const len = Math.min(values.length, xms.length);
                const base = {
                    type,
                    name,
                    color,
                    visible,
                    showInLegend: visible,
                    stack,
                    dashStyle: dashStyle ?? defaultSeriesDashStyle,
                    data: xms.slice(0, len).map((t, i) => [t, values[i]]),
                    marker: { enabled: type !== "column" },
                    turboThreshold: 0,
                };
                return fillColor ? { ...base, fillColor } : base;
            });
        }

        // Categorical
        return entries.map(([name, values = []]) => {
            const { type, color, fillColor, visible, stack, dashStyle } = getSeriesCfg(name, chartTypeConfig);
            const len = Math.min(values.length, xAxis.length);
            const base = {
                type,
                name,
                color,
                visible,
                showInLegend: visible,
                stack,
                dashStyle: dashStyle ?? defaultSeriesDashStyle,
                data: values.slice(0, len),
                marker: { enabled: type !== "column" },
                turboThreshold: 0,

            };
            return fillColor ? { ...base, fillColor } : base;
        });
    }, [chartData, xAxis, isEpoch, chartTypeConfig, defaultSeriesDashStyle]);

    const backgroundColor = isDark
        ? "linear-gradient(180deg, #000 0%, #000 0%, #2b2f3a 100%, #2b2f3a 100%)"
        : "#fff";

    // ----- X Axis (datetime variant) -----
    const epochXAxisOptions = useMemo(
        () => ({
            type: "datetime",
            minPadding: 0.01,
            maxPadding: 0.03,
            crosshair: { width: 1, color: "rgba(128,128,128,0.5)", dashStyle: "Dash", zIndex: 4 },
            startOnTick: false,
            endOnTick: false,
            tickWidth: 1,
            tickmarkPlacement: "on",
            gridLineWidth: isGridLine ? 1 : 0,
            gridLineColor: isDark ? "#234646" : "#e6e6e6",
            lineColor: isDark ? "#999999" : "#333333",
            labels: { style: { color: isDark ? "#ffffff" : "#333333" } },
            events: {
                setExtremes(e) {
                    if (e.trigger === "sync") return;
                    syncBus.publish({ type: "zoomX", sourceId: instanceIdRef.current, min: e.min ?? null, max: e.max ?? null });
                },
            },
            plotLines: buildXAxisPlotLine({
                isEpoch: true,
                plotLinePoint,
                plotLineLabel,
                isDark,
                plotLineDashStyle,
            }),
            plotBands: buildXAxisPlotBands({ isEpoch: true, xAxis, isDark, enable: plotBand }),
        }),
        [xAxis, isDark, plotLinePoint, plotLineLabel, plotBand, isGridLine, plotLineDashStyle]
    );

    const options = useMemo(
        () => {
            return ({
                chart: {
                    zoomType: "xy",
                    backgroundColor,
                    animation: false,
                    height: chartHeight,
                    events: {
                        load() {
                            this.container?.addEventListener("mouseleave", () => {
                                syncBus.publish({ type: "leave", sourceId: instanceIdRef.current });
                            });
                        },
                    },
                },
                title: { useHTML: true, text: title, style: { color: isDark ? "#F9F6EE" : "#000000", fontSize: "16px" } },
                xAxis: isEpoch
                    ? epochXAxisOptions
                    : {
                        minPadding: 0.01,
                        maxPadding: 0.03,
                        categories: xAxis,
                        crosshair: { width: 1, color: "rgba(128,128,128,0.5)", dashStyle: "Dash", zIndex: 4 },
                        startOnTick: true,
                        endOnTick: false,
                        tickWidth: 1,
                        tickmarkPlacement: "on",
                        gridLineColor: isDark ? "#234646" : "#e6e6e6",
                        lineColor: isDark ? "#999999" : "#333333",
                        events: {
                            setExtremes(e) {
                                if (e.trigger === "sync") return;
                                syncBus.publish({
                                    type: "zoomX",
                                    sourceId: instanceIdRef.current,
                                    min: e.min ?? null,
                                    max: e.max ?? null,
                                });
                            },
                        },
                        labels: { style: { color: isDark ? "#ffffff" : "#333333" } },
                        plotLines: buildXAxisPlotLine({
                            isEpoch: false,
                            plotLinePoint,
                            plotLineLabel,
                            isDark,
                            axisCategories: xAxis,
                            plotLineDashStyle,
                        }),
                        plotBands: buildXAxisPlotBands({
                            isEpoch: false,
                            axisCategories: xAxis,
                            isDark,
                            enable: plotBand,
                        }),
                    },
                yAxis: {
                    title: { text: "" },
                    gridLineColor: isDark ? "#234646" : "#e6e6e6",
                    gridLineWidth: isGridLine ? 1 : 0,
                    lineColor: isDark ? "#666666" : "#333333",
                    lineWidth: 0,
                    labels: { style: { color: isDark ? "#c5c7c9" : "#333333" } },
                    plotLines: [{ value: 0, color: "#94a3b8", width: 2, zIndex: 3 }],
                    crosshair: { width: 1, color: "rgba(128,128,128,0.5)", dashStyle: "Dash", zIndex: 4 },
                    events: {
                        setExtremes(e) {
                            if (e.trigger === "sync") return;
                            syncBus.publish({ type: "zoomY", sourceId: instanceIdRef.current, min: e.min ?? null, max: e.max ?? null });
                        },
                    },
                },
                tooltip: {
                    useHTML: true,
                    borderWidth: 0,
                    backgroundColor: "transparent", // let custom container handle bg
                    style: {
                        color: isDark ? "#ffffff" : "#000",
                        fontSize: "14px",
                    },
                    shared: true,
                    formatter: makeTooltipFormatter({ isEpoch, isDark, tooltipDesc, formatSeriesName }),
                },

                legend: { enabled: false },
                plotOptions: {
                    series: {
                        clip: true,
                        cropThreshold: 1000000,
                        connectNulls: true,
                        animation: false,
                        states: { inactive: { opacity: 1 }, hover: { lineWidth: 2 } },
                        marker: { enabled: true, radius: 1, lineWidth: 0, states: { hover: { enabled: false } } },
                        point: {
                            events: {
                                mouseOver() {
                                    syncBus.publish({
                                        type: "hover",
                                        sourceId: instanceIdRef.current,
                                        x: this.x,
                                        xIndex: this.index,
                                        category: this.category,
                                    });
                                },
                                mouseOut() {
                                    syncBus.publish({ type: "leave", sourceId: instanceIdRef.current });
                                },
                            },
                        },
                    },
                    column: { stacking: stackedColumns ? "normal" : undefined },
                    area: {
                        lineWidth: 2,
                        fillOpacity: 0.25,
                        marker: { enabled: false },
                        states: { hover: { lineWidth: 2 } },
                        zIndex: 0,
                    },
                    line: {
                        zIndex: 5,
                    }
                },
                series,
                credits: { enabled: false },
            });
        },
        [
            title,
            xAxis,
            isEpoch,
            series,
            stackedColumns,
            backgroundColor,
            plotLinePoint,
            plotLineLabel,
            isDark,
            epochXAxisOptions,
            chartHeight,
            isGridLine,
            plotBand,
            plotLineDashStyle,
        ]
    );

    // ----- Cross-chart sync -----
    useEffect(() => {
        const unsub = syncBus.subscribe((evt) => {
            const chart = chartRef.current?.chart;
            if (!chart || !evt || evt.sourceId === instanceIdRef.current) return;

            if (evt.type === "zoomX") {
                chart.xAxis[0].setExtremes(evt.min, evt.max, true, false, { trigger: "sync" });
                return;
            }
            if (evt.type === "zoomY") {
                chart.yAxis[0].setExtremes(evt.min, evt.max, true, false, { trigger: "sync" });
                return;
            }
            if (evt.type === "hover") {
                if (isEpoch) {
                    const pointsAtX = [];
                    chart.series.forEach((s) => {
                        if (s.visible === false) return;
                        const p = s.points?.find((pt) => pt && pt.x === evt.x);
                        if (p) pointsAtX.push(p);
                    });
                    if (pointsAtX.length) {
                        chart.tooltip.refresh(pointsAtX);
                        chart.xAxis[0].drawCrosshair(undefined, pointsAtX[0]);
                    }
                } else {
                    const cats = chart.xAxis?.[0]?.categories || [];
                    const idx = typeof evt.xIndex === "number" && evt.xIndex >= 0 ? evt.xIndex : cats.indexOf(evt.category);
                    if (idx < 0) return;
                    const pointsAtIdx = [];
                    chart.series.forEach((s) => {
                        if (s.visible === false) return;
                        if (s.points && s.points[idx]) pointsAtIdx.push(s.points[idx]);
                    });
                    if (pointsAtIdx.length) {
                        chart.tooltip.refresh(pointsAtIdx);
                        chart.xAxis[0].drawCrosshair(undefined, pointsAtIdx[0]);
                    }
                }
            }
        });
        return unsub;
    }, [isEpoch]);

    if (!xAxis || xAxis.length === 0) {
        return <div style={{ width, height }}>No data</div>;
    }

    return (
        <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={options}
            containerProps={{ style: { width, height } }}
        />
    );
}

export default AppChart;