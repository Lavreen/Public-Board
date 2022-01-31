import { StyleSheet } from "react-native";
import { DefaultTheme } from "react-native-paper";

export const theme = {
	...DefaultTheme,
	roundness: 4,
	colors: {
		...DefaultTheme.colors,
		primary: '#3f51b5',
		accent: '#757de8',
	},
};

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	surface: {
		padding: 10,
		elevation: 10,
		flex: 1,
		flexDirection: "column",
		flexGrow: 1,
		alignItems: "stretch",
		height: "100%"
	},
	homeScreenButton: {
		marginVertical: 2,
	},
	title: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	center: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center'
	},
	margin: {
		marginVertical: 5,
		marginHorizontal: 10
	},
	modal: {
		backgroundColor: 'white',
		padding: 20
	}
});