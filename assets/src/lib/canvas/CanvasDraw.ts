import throttle from "lodash.throttle";
import Konva from "konva";
import type {
  CanvasLayer,
  CanvasSettings,
  CanvasSettingsReceiver,
} from "./CanvasBase";

interface CanvasDrawOptions {
  onDrawLine(data: Konva.LineConfig): void;
}

export class CanvasDraw implements CanvasLayer, CanvasSettingsReceiver {
  private isDrawing = false;
  private allowDraw = false;
  private lastLine: Konva.Line | null = null;

  private layer: Konva.Layer;

  constructor(private stage: Konva.Stage, private options: CanvasDrawOptions) {
    this.layer = new Konva.Layer();
  }

  init() {
    this.stage.add(this.layer);

    this.stage.on("mousedown touchstart", this.handleMouseDown);
    this.stage.on("mouseup touchend", this.handleMouseUp);
    this.stage.on("mousemove touchmove", this.handleMouseMove);
  }

  private handleMouseDown = () => {
    if (!this.allowDraw) {
      this.isDrawing = false;
      return;
    }

    this.isDrawing = true;

    const pos = this.stage.getRelativePointerPosition();

    this.lastLine = new Konva.Line({
      stroke: "rgba(217, 119, 6, 1)", // TODO: take from settings
      strokeWidth: 10,
      globalCompositeOperation: "source-over",
      lineCap: "round",
      lineJoin: "round",
      points: [pos.x, pos.y, pos.x, pos.y],
    });

    this.layer.add(this.lastLine);
  };

  private handleData = throttle((data: any) => {
    this.options.onDrawLine(data);
  }, 200);

  private handleMouseUp = () => {
    this.isDrawing = false;
  };

  private handleMouseMove = (event: Konva.KonvaEventObject<PointerEvent>) => {
    if (!this.isDrawing || !this.allowDraw || !this.lastLine) {
      return;
    }

    event.evt.preventDefault();

    const pos = this.stage.getRelativePointerPosition();
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);

    this.lastLine.points(newPoints);

    this.handleData(this.lastLine.toObject());
  };

  settingsUpdated = (settings: CanvasSettings) => {
    this.allowDraw = settings.mode === "draw";
  };

  draw(): void {
    /*
    // Example

    const line = new Konva.Line({
      attrs: {
        stroke: "#ccc",
        strokeWidth: 10,
        lineCap: "round",
        lineJoin: "round",
        points: [
          1596, 1280, 1596, 1280, 1594, 1280, 1594, 1280, 1594, 1280, 1592,
          1280, 1592, 1282, 1592, 1286, 1594, 1290, 1596, 1294, 1600, 1298,
          1604, 1302, 1612, 1306, 1620, 1308, 1628, 1308, 1636, 1308, 1646,
          1308, 1654, 1304, 1662, 1300, 1670, 1296, 1674, 1290, 1680, 1284,
          1682, 1276, 1684, 1268, 1684, 1256, 1680, 1244, 1674, 1234, 1666,
          1220, 1652, 1204, 1638, 1192, 1628, 1186, 1618, 1182, 1606, 1178,
          1596, 1178, 1588, 1178, 1576, 1184, 1564, 1192, 1548, 1206, 1534,
          1220, 1518, 1240, 1504, 1260, 1496, 1274, 1488, 1292, 1482, 1308,
          1480, 1324, 1480, 1338, 1484, 1354, 1494, 1370, 1508, 1382, 1522,
          1394, 1538, 1404, 1552, 1410, 1570, 1416, 1590, 1418, 1614, 1420,
          1638, 1418, 1660, 1414, 1678, 1408, 1702, 1394, 1724, 1380, 1736,
          1370, 1750, 1354, 1760, 1340, 1766, 1322, 1768, 1302, 1768, 1290,
          1760, 1262, 1744, 1228, 1726, 1202, 1706, 1178, 1684, 1158, 1664,
          1142, 1650, 1132, 1630, 1124, 1604, 1114, 1582, 1110, 1560, 1110,
          1536, 1114, 1510, 1124, 1482, 1138, 1456, 1156, 1432, 1176, 1410,
          1198, 1392, 1222, 1376, 1252, 1362, 1286, 1346, 1334, 1336, 1380,
          1332, 1416, 1330, 1456, 1332, 1494, 1342, 1526, 1366, 1562, 1394,
          1590, 1422, 1610, 1456, 1628, 1490, 1638, 1526, 1644, 1574, 1646,
          1628, 1640, 1678, 1622, 1732, 1594, 1786, 1554, 1840, 1506, 1884,
          1458, 1918, 1412, 1944, 1360, 1962, 1300, 1964, 1242, 1950, 1188,
          1916, 1130, 1872, 1076, 1830, 1042, 1790, 1016, 1746, 992, 1702, 978,
          1652, 970, 1598, 966, 1554, 968, 1502, 982, 1456, 1000, 1410, 1024,
          1354, 1060, 1306, 1102, 1268, 1144, 1244, 1174, 1206, 1244, 1166,
          1338, 1150, 1408, 1142, 1470, 1142, 1546, 1148, 1618, 1154, 1650,
          1184, 1714, 1232, 1792, 1290, 1850, 1356, 1900, 1408, 1934, 1460,
          1964, 1508, 1984, 1556, 1996, 1620, 2000, 1678, 1988, 1726, 1960,
          1800, 1894, 1880, 1810, 1934, 1738, 1990, 1662, 2034, 1600, 2066,
          1550, 2100, 1490, 2124, 1418, 2134, 1342, 2116, 1248, 2070, 1142,
          2006, 1056, 1916, 974, 1828, 916, 1752, 884, 1674, 862, 1606, 854,
          1556, 852, 1510, 854, 1458, 862, 1402, 876, 1350, 894, 1306, 916,
          1258, 948, 1204, 992, 1158, 1050, 1118, 1116, 1084, 1194, 1064, 1284,
          1056, 1376, 1056, 1464, 1062, 1556, 1074, 1642, 1096, 1720, 1132,
          1800, 1194, 1886, 1254, 1948, 1302, 1980, 1354, 2006, 1418, 2028,
          1476, 2038, 1520, 2038, 1572, 2028, 1630, 2010, 1690, 1984, 1748,
          1956, 1836, 1916, 1928, 1874, 1990, 1848, 2076, 1800, 2184, 1732,
          2272, 1654, 2346, 1552, 2384, 1438, 2400, 1274, 2404, 1090, 2400, 986,
          2362, 840, 2302, 656, 2246, 560, 2188, 500, 2112, 462, 2020, 442,
          1950, 436, 1854, 454, 1726, 488, 1616, 530, 1500, 582, 1384, 644,
          1282, 710, 1204, 770, 1136, 832, 1072, 902, 1022, 976, 984, 1056, 962,
          1134, 948, 1222, 942, 1314, 944, 1392, 954, 1468, 992, 1564, 1080,
          1692, 1194, 1804, 1274, 1862, 1338, 1898, 1404, 1930, 1462, 1950,
          1512, 1960, 1552, 1954, 1578, 1940, 1588, 1932, 1600, 1932, 1632,
          1924, 1670, 1912, 1716, 1894, 1782, 1862, 1864, 1806, 1932, 1740,
          1980, 1666, 2020, 1586, 2044, 1524, 2066, 1460, 2094, 1382, 2124,
          1314, 2148, 1256, 2162, 1224, 2170, 1206,
        ],
      },
    });

    this.layer.add(line);
    */
  }

  destroy() {
    this.stage.off("mousedown touchstart", this.handleMouseDown);
    this.stage.off("mouseup touchend", this.handleMouseUp);
    this.stage.off("mousemove touchmove", this.handleMouseMove);

    this.layer.destroy();
  }
}
