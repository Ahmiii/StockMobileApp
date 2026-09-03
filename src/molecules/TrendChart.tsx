import {
  Canvas,
  DashPathEffect,
  LinearGradient,
  Path,
  Skia,
  vec,
  type SkPath,
} from "@shopify/react-native-skia";
import { Fragment, useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

export type TrendSeries = {
  values: number[];
  color: string;
  area?: boolean;
  dotted?: boolean;
};

type Props = {
  series: TrendSeries[];
  height?: number;
  strokeWidth?: number;
};

const withAlpha = (color: string, alpha: number) => {
  const [r, g, b] = Skia.Color(color);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
};

const TrendChart = ({ series, height = 120, strokeWidth = 2 }: Props) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const paths = useMemo(() => {
    if (width === 0) return [];

    const all = series.flatMap((s) => s.values);
    const min = Math.min(...all);
    const range = Math.max(...all) - min || 1;
    const steps = Math.max(...series.map((s) => s.values.length)) - 1 || 1;
    const inset = strokeWidth;
    const innerHeight = height - inset * 2;

    return series.map((s) => {
      const points = s.values.map((v, i) => ({
        x: (i / steps) * width,
        y: inset + innerHeight * (1 - (v - min) / range),
      }));

      const line = Skia.Path.Make();
      points.forEach((p, i) =>
        i === 0 ? line.moveTo(p.x, p.y) : line.lineTo(p.x, p.y),
      );

      let area: SkPath | null = null;
      if (s.area && points.length > 1) {
        area = line.copy();
        area.lineTo(points[points.length - 1].x, height);
        area.lineTo(points[0].x, height);
        area.close();
      }

      return { line, area, color: s.color, dotted: s.dotted === true };
    });
  }, [series, width, height, strokeWidth]);

  return (
    <View onLayout={onLayout} style={{ height }}>
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
                {/* A near-zero dash with round caps renders as a dot. */}
                {p.dotted && (
                  <DashPathEffect intervals={[0.1, strokeWidth * 2.5]} />
                )}
              </Path>
            </Fragment>
          ))}
        </Canvas>
      )}
    </View>
  );
};

export default TrendChart;
