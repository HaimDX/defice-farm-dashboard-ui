export const PLATFORM = [
  {
    label: "IOS",
    value: "ios",
  },
  {
    label: "ANDROID",
    value: "android",
  },
];

export const PROJECT = [
  {
    label: "Stage",
    value: "Stage",
  },
  {
    label: "Production",
    value: "Production",
  },
]

export const STATUS = [
  {
    label: "RUNNING",
    value: "running",
  },
  {
    label: "PASSED",
    value: "passed",
  },
  {
    label: "FAILED",
    value: "failed",
  },
  {
    label: "TIMEOUT",
    value: "timeout",
  },
];

interface DeviceFilters {
  ios: {
    [deviceName: string]: string;
  };
  android: {
    [deviceName: string]: string;
  };
}

export const DEVICE_FILTERS : DeviceFilters = {
  ios: {
    "iPhone XS": "00008020-000930C10A38002E",
    "iPhone X": "122e949df238deb70754a5997bfed5c9136c6a47",
    "iPhone 12 mini": "00008101-00196DD026F0001E",
  },
  android: {
    "Samsung Galaxy S10": "RF8MC25GVTK",
    "Redmi Note 14": "q8oz6t7prsvs6le6",
  },
};