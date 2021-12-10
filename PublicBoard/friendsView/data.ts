import { ActivityIndicatorComponent } from "react-native";

interface State {
    timer: null,
    counter: 0
}
interface Friend {
    id: number,
    name: string,
    pub_key: string,
}

const Friends: Friend[] =  [
    {
        id: 1,
        name: "Adam",
        pub_key: "RSA-key-example-1"
    },
    {
        id: 2,
        name: "Wojtek",
        pub_key: "RSA-key-example-2"
    },
    {
        id: 3,
        name: "Kuba",
        pub_key: "RSA-key-example-3"
    },
    {
        id: 4,
        name: "Michał",
        pub_key: "RSA-key-example-4"
    }
];

export { Friends };
export type { Friend };
