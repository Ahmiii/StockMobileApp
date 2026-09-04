import {
  Canvas,
  Circle,
  DashPathEffect,
  Line,
  LinearGradient,
  Path,
  Skia,
  vec,
  type SkPath,
} from "@shopify/react-native-skia";
import { Fragment, useMemo, useState } from "react";
import {
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";

export type TrendSeries = {
  values: number[];
  color: string;
  area?: boolean;
  dotted?: boolean;
  /** Shown in the tooltip, e.g. "Portfolio". */
  label?: string;
};

type Props = {
  series: TrendSeries[];
  height?: number;
  strokeWidth?: number;
  /**
   * One label per point (e.g. dates). When given, the chart becomes
   * scrubbable: touch or drag to see a marker and a tooltip for that point.
   */
  labels?: string[];
  /** How to print a series value in the tooltip. Defaults to two decimals. */
  formatValue?: (value: number) => string;
};

const withAlpha = (color: string, alpha: number) => {
  const [r, g, b] = Skia.Color(color);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
};

const TrendChart = ({
  series,
  height = 120,
  strokeWidth = 2,
  labels,
  formatValue = (value) => value.toFixed(2),
}: Props) => {
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const steps = Math.max(...series.map((s) => s.values.length)) - 1 || 1;

  const paths = useMemo(() => {
    if (width === 0) return [];

    const all = series.flatMap((s) => s.values);
    const min = Math.min(...all);
    const range = Math.max(...all) - min || 1;
    const inset = strokeWidth;
    const innerHeight = height - inset * 2;

    return series.map((s) => {
      const points = s.values.map((v, i) => ({
        x: (i / steps) * width,
        y: inset + innerHeight * (1 - (v - min) / range),
      }));

      const builder = Skia.PathBuilder.Make();
      points.forEach((p, i) =>
        i === 0 ? builder.moveTo(p.x, p.y) : builder.lineTo(p.x, p.y),
      );
      const line = builder.build();

      let area: SkPath | null = null;
      if (s.area && points.length > 1) {
        area = builder
          .lineTo(points[points.length - 1].x, height)
          .lineTo(points[0].x, height)
          .close()
          .detach();
      }

      return { line, area, points, color: s.color, dotted: s.dotted === true };
    });
  }, [series, width, height, strokeWidth, steps]);

  // Scrubbing: map the touch x to the nearest point index.
  const interactive = labels !== undefined;

  const indexAt = (x: number) => {
    const index = Math.round((x / width) * steps);
    return Math.min(Math.max(index, 0), steps);
  };

  const onTouch = (e: GestureResponderEvent) => {
    if (!interactive) return;
    setActive(indexAt(e.nativeEvent.locationX));
  };

  const onRelease = () => setActive(null);

  const markerX = active === null ? 0 : (active / steps) * width;
  const tooltipStyle =
    markerX < width / 2
      ? { left: markerX + 10 }
      : { right: width - markerX + 10 };

  return (
    <View
      onLayout={onLayout}
      style={{ height }}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={onRelease}
      onTouchCancel={onRelease}
    >
      {width > 0 && (
        <Canvas style={{ width, height }}>
          {paths.map((p, i) => (
            <Fragment key={i}>
              {p.area && (
                <Path path={p.area} style="fill">
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, height)}
                    colors={[withAlpha(p.color, 0.35), withAlpha(p.color, 0)]}
                  />
                </Path>
              )}
              <Path
                path={p.line}
                color={p.color}
                style="stroke"
                strokeWidth={strokeWidth}
                strokeJoin="round"
                strokeCap="round"
              >
                {p.dotted && (
                  <DashPathEffect intervals={[0.1, strokeWidth * 2.5]} />
                )}
              </Path>
            </Fragment>
          ))}

          {active !== null && paths.length > 0 && (
            <>
              <Line
                p1={vec(markerX, 0)}
                p2={vec(markerX, height)}
                color={withAlpha(paths[0].color, 0.5)}
                strokeWidth={1}
              />
              {paths.map((p, i) => {
                const point = p.points[active];
                if (!point) return null;
                return (
                  <Circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={strokeWidth * 2}
                    color={p.color}
                  />
                );
              })}
            </>
          )}
        </Canvas>
      )}

      {active !== null && labels && (
        <View
          pointerEvents="none"
          className="absolute top-0 gap-0.5 rounded-lg border border-border bg-card px-2.5 py-1.5"
          style={tooltipStyle}
        >
          <Text className="text-xs font-semibold text-muted">
            {labels[active]}
          </Text>
          {series.map((s, i) => {
            const value = s.values[active];
            if (value === undefined) return null;
            return (
              <View key={i} className="flex-row items-center gap-1.5">
                <View
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <Text className="text-xs text-foreground">
                  {s.label ?? `Series ${i + 1}`}{" "}
                  <Text className="font-semibold">{formatValue(value)}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default TrendChart;
