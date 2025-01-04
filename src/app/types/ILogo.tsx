import LogoClockIcon from "../components/LogoClockIcon";

export enum LogoMode{
    Icon=3,
    Avatar=2,
    Home=1
}
export default interface LogoIconProps{
    mode:LogoMode;
}
