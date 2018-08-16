/*In-Built*/
import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

/*Constants & Enums*/
import { AppConstant } from '../../../constants/app.constants';

/*Models*/

/*Services*/
import { Chart } from 'chart.js'
import { AppSettingsService } from '../../../shared/appSetting.service';
import tooltip from 'devextreme/ui/tooltip';
import { DirectionEnum } from 'src/enums/common.enums';

@Component({
  selector: 'app-chart-js',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.css']
})
export class ChartJSComponent implements OnInit {
  @ViewChild('myChart') myChart: ElementRef;
  @Input() Type: any;

  /*tracking the change in this property if i want to track all propety then i will choose ngonchanges */
  @Input()
  set selectedParameter(value: string) {
    this.parameterValue = value;
  }

  get selectedParameter(): string { return this.parameterValue; }

  @Input() Labels: any;
  @Input() DataSets: any;
  @Input() MinValueDataSets: any;
  @Input() MaxValueDataSets: any;
  @Input() StandardValueDataSets: any;
  @Input() SliderVisible: boolean = true;
  @Input() SliderDirection: string = DirectionEnum.Top;
  @Input() ParameterVisible: boolean = true;
  @Input() Options: any;
  @Output() notifySliderChange = new EventEmitter<any>();

  defaultLabels: any = [];
  defaultDataSets: any = [];
  defaultMaxDataSets: any = [];
  defaultMinDataSets: any = [];
  defaultOptions: any = {};
  defaultChart: any;
  sliderValue: number = 0;
  sliderStep: number = 2;
  parameterValue: string = "";

  constructor(private _appSettingsService: AppSettingsService) {
    this.sliderStep = this._appSettingsService.getSliderStep();
    this.sliderValue = this._appSettingsService.getSliderDefaultValue();
    this.format = this.format.bind(this);
    this.onSliderInitialized = this.onSliderInitialized.bind(this);
  }

  ngOnInit() {
    this.defaultOptions = {
      responsive: true,
      legend: {
        display: false
      },
      animation: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      }
    };
    this.renderChart();
  }

  private renderChart() {
    this.defaultChart = new Chart(this.myChart.nativeElement.getContext('2d'), {
      type: this.Type,
      data: {
        labels: this.defaultLabels,
        datasets: [{
          label: '',
          backgroundColor: AppConstant.defaultChartColor,
          borderColor: AppConstant.defaultChartColor,
          pointRadius: 1,
          fill: false,
          data: this.defaultDataSets,
          borderWidth: 1,
        }]
      },
      options: this.defaultOptions
    });
  }

  updateChart(data: any, label: any, min: any = "", max: any = "", lineColor: any = "") {
    this.defaultChart.data = {
      labels: label,
      datasets: [{
        label: '',
        backgroundColor: !!lineColor ? lineColor : AppConstant.defaultChartColor,
        borderColor: !!lineColor ? lineColor : AppConstant.defaultChartColor,
        pointRadius: 1,
        fill: false,
        data: data,
        borderWidth: 1
      },
      {
        label: '',
        backgroundColor: AppConstant.minColor,
        borderColor: AppConstant.minColor,
        pointRadius: 1,
        fill: false,
        data: !!min ? min : this.defaultMinDataSets,
        borderWidth: 1
      },
      {
        label: '',
        backgroundColor: AppConstant.maxColor,
        borderColor: AppConstant.maxColor,
        pointRadius: 1,
        fill: false,
        data: !!max ? max : this.defaultMaxDataSets,
        borderWidth: 1
      }],
      options: this.defaultOptions
    }
    this.defaultChart.update();

  }


  /*Slider Event*/
  //sliderValueChanged(event: any) {
  //    this.sliderValue = event.value;
  //    this.notifySliderChange.emit(this.sliderValue);
  //}

  isSliderOnBottom() {
    return this.SliderDirection == DirectionEnum.Bottom ? true : false;
  }

  isSliderOnTop() {
    return this.SliderDirection == DirectionEnum.Top ? true : false;
  }

  setSliderValue(value: number) {
    this.sliderValue = value;
  }

  slidePrevious() {
    if (this.sliderValue != 0) {
      this.sliderValue -= this.sliderStep;
      this.notifySliderChange.emit({ Hour: this.sliderValue, addDay: 0 });
    }
    else {
      this.sliderValue = 22;
      this.notifySliderChange.emit({ Hour: this.sliderValue, addDay: -1 });
    }
  }

  slideNext() {
    if (this.sliderValue != 22) {
      this.sliderValue += this.sliderStep;
      this.notifySliderChange.emit({ Hour: this.sliderValue, addDay: 0 });
    }
    else {
      this.sliderValue = 0;
      this.notifySliderChange.emit({ Hour: this.sliderValue, addDay: 1 });
    }
  }

  onSliderInitialized(e: any) {
    var componentObject = this;
    //var slider = e.component;
    //var swipeEndHandlerBase = slider._swipeEndHandler;
    //slider._swipeEndHandler = function () {
    //    swipeEndHandlerBase.apply(slider, arguments);
    //    componentObject.notifySliderChange.emit(slider.option("value"));
    //    componentObject.sliderValue = slider.option("value");
    //};

    var slider = e.component;
    var swipeEndHandlerBase = slider._swipeEndHandler;

    var sliderelement = e.element;
    var sliderclick = sliderelement.onclick;

    sliderelement.onclick = function () {
      componentObject.notifySliderChange.emit({ Hour: slider.option("value"), addDay: 0 });
      componentObject.sliderValue = slider.option("value");
    };

    slider._swipeEndHandler = function () {
      swipeEndHandlerBase.apply(slider, arguments);
      componentObject.notifySliderChange.emit({ Hour: slider.option("value"), addDay: 0 });
      componentObject.sliderValue = slider.option("value");
    };
  }


  format(value: any) {
    return value + "-" + (value + this.sliderStep);
  }
}
