export default interface countdownWaitingProps {
    endDate: Date | null
    onComplete: () => void;
}