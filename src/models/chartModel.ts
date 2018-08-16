export class ChartModel {
    Id: string;
    Name: string;
    Code: string;
}

export class ChartConfig {
    title: string;

    constructor(title: string) {
        this.title = title;
    }
}