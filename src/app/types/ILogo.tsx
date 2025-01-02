import LogoClockIcon from "../components/LogoClockIcon";

export enum LogoMode{
    Icon=1,
    Avatar=2,
    Home=3
}
export default interface LogoIconProps{
    mode:LogoMode;
}
