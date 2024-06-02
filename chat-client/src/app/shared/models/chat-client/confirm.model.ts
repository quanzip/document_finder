import {DocumentItem} from "./documentItem";

export class ConfirmModel {
    confirmQuestions: DocumentItem[] = [];
    features: string[] = [];
    exploredFeatures: string[] = [];
    question: string= '';
    rejected: boolean = false;
}