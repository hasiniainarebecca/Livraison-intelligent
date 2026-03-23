import React from "react";
import {
  Svg,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Circle,
} from "react-native-svg";
import { COLORS } from "../../constants/livreur/colors";

const Icon = ({ name, size = 20, color = COLORS.text }) => {
  const p = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };

  const icons = {
    home: <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" {...p} />,
    map: (
      <>
        <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" {...p} />
        <Line x1="8" y1="2" x2="8" y2="18" {...p} />
        <Line x1="16" y1="6" x2="16" y2="22" {...p} />
      </>
    ),
    package: (
      <>
        <Line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...p} />
        <Path
          d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          {...p}
        />
        <Polyline points="3.27 6.96 12 12.01 20.73 6.96" {...p} />
        <Line x1="12" y1="22.08" x2="12" y2="12" {...p} />
      </>
    ),
    bell: (
      <>
        <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" {...p} />
        <Path d="M13.73 21a2 2 0 01-3.46 0" {...p} />
      </>
    ),
    user: (
      <>
        <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...p} />
        <Circle cx="12" cy="7" r="4" {...p} />
      </>
    ),
    history: (
      <>
        <Polyline points="12 8 12 12 14 14" {...p} />
        <Path d="M3.05 11a9 9 0 1 0 .5-4.5" {...p} />
        <Polyline points="3 3 3 7 7 7" {...p} />
      </>
    ),
    check: <Polyline points="20 6 9 17 4 12" {...p} />,
    phone: (
      <Path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 11.79a19.79 19.79 0 01-3.07-8.67A2 2 0 011.93 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        {...p}
      />
    ),
    navigation: <Polygon points="3 11 22 2 13 21 11 13 3 11" {...p} />,
    scan: (
      <>
        <Polyline points="23 7 23 1 17 1" {...p} />
        <Line x1="17" y1="7" x2="23" y2="1" {...p} />
        <Polyline points="1 17 1 23 7 23" {...p} />
        <Line x1="7" y1="17" x2="1" y2="23" {...p} />
        <Polyline points="1 7 1 1 7 1" {...p} />
        <Line x1="7" y1="1" x2="1" y2="7" {...p} />
        <Polyline points="23 17 23 23 17 23" {...p} />
        <Line x1="17" y1="23" x2="23" y2="17" {...p} />
      </>
    ),
    arrow: <Polyline points="9 18 15 12 9 6" {...p} />,
    arrowLeft: <Polyline points="15 18 9 12 15 6" {...p} />,
    star: (
      <Polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        {...p}
      />
    ),
    truck: (
      <>
        <Rect x="1" y="3" width="15" height="13" {...p} />
        <Polygon points="16 8 20 8 23 11 23 16 16 16 16 8" {...p} />
        <Circle cx="5.5" cy="18.5" r="2.5" {...p} />
        <Circle cx="18.5" cy="18.5" r="2.5" {...p} />
      </>
    ),
    lightning: (
      <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p} />
    ),
    close: (
      <>
        <Line x1="18" y1="6" x2="6" y2="18" {...p} />
        <Line x1="6" y1="6" x2="18" y2="18" {...p} />
      </>
    ),
    settings: (
      <>
        <Circle cx="12" cy="12" r="3" {...p} />
        <Path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          {...p}
        />
      </>
    ),
    location: (
      <>
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" {...p} />
        <Circle cx="12" cy="10" r="3" {...p} />
      </>
    ),
    wallet: (
      <>
        <Rect x="2" y="5" width="20" height="14" rx="2" {...p} />
        <Line x1="2" y1="10" x2="22" y2="10" {...p} />
        <Circle cx="17" cy="15" r="1" {...p} />
      </>
    ),
    menu: (
      <>
        <Line x1="3" y1="12" x2="21" y2="12" {...p} />
        <Line x1="3" y1="6" x2="21" y2="6" {...p} />
        <Line x1="3" y1="18" x2="21" y2="18" {...p} />
      </>
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name]}
    </Svg>
  );
};

export default Icon;
