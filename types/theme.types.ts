import '@mui/material/styles';

declare module '@mui/material/styles' {

    interface CommonColors {
        // mainAppColor: string;
        appRedColor: string;
        buttonHoverColor: string
        focusColor: string
        whiteTone: string
    }

    interface PaletteOptions {
        common?: Partial<CommonColors>
    }


    interface ThemeOptions {
        palette?: PaletteOptions
    }

}