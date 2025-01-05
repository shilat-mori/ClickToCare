export default interface countdownWaitingProps {
    endDate: Date | null;
    rejected: boolean;
    onComplete: () => void;
}