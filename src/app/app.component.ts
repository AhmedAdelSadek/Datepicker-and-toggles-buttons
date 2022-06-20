import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material";
import * as moment from "moment";
//import moment from 'moment';

@Component({
  selector: "todo-app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  toggleEnum = ToggleEnum;
  maxDate: string;
  // set the initial value of datepicker FormControl
  date = new FormControl(new Date());
  TooltipLiveDisabled: FormControl = new FormControl(true);
  TooltipTagDisabled: FormControl = new FormControl(false);
  TooltipWocheDisabled: FormControl = new FormControl(false);
  disabledLive = false;
  disabledTag = false;
  disabledWoche = false;
  selectedState = undefined;
  // show content in second header
  showToggleSelected = "Live Performance";
  dayNumber = new Date(this.date.value).getDay();
  constructor() {
    // set the maxDate to Today
    this.maxDate = moment(new Date()).format("YYYY-MM-DD");
  }
  ngOnInit() {
    // if the today is saturday or sunday
    if (this.dayNumber === 0 || this.dayNumber === 6) {
      // calling initial Default Value as Tag Toggle for toggle Group
      this.setDefaultValuetoggleGroupAsTag();
    } else {
      // calling initial Default Value as Live Toggle for toggle Group
      this.setDefaultValuetoggleGroupAsLive();
    }
  }
  /**
   * set initial Default Values for all toggles in Days (monday - Tuesday - Wednesday - thursday - friday )
   */
  setDefaultValuetoggleGroupAsLive() {
    const datePickerValue = moment(this.date.value).format("YYYY-MM-DD");
    const today = moment(new Date()).format("YYYY-MM-DD");
    if (datePickerValue === today) {
      this.setColorAndBackground("toggleLive");
      // set unactive toggles
      this.setUnAtiveToggle("toggleTag", "toggleWoche");
      // live is selected toggle as default in toggle-group
      this.selectedState = 0;
      // disable tag toggle => not clickable
      this.disabledTag = true;
      // disable woche toggle => not clickable
      this.disabledWoche = true;
    }
  }
  /**
   * set initial Default Values for all toggles in Days saturday and sunday
   */
  setDefaultValuetoggleGroupAsTag() {
    // set selected toggle
    this.setColorAndBackground("toggleTag");
    // set unactive toggles
    this.setUnAtiveToggle("toggleLive", "toggleWoche");
    // remove hover
    this.removeHandlerToggleWoche();
    this.removeHandlerToggleTag();
    this.removeHandlerToggleLive();
    // Tag is selected toggle in toggle-group
    this.selectedState = 1;
    // show content in second header
    this.showToggleSelected = "Tagesperformance";
    //  tag toggle => clickable
    this.disabledTag = false;
    // Woche toggle => not clickable
    this.disabledWoche = true;
    // Live toggle => not clickable
    this.disabledLive = true;
    // disable tool tip for tag toggle
    this.TooltipTagDisabled.patchValue(true);
    // show tool tip for woche toggle
    this.TooltipWocheDisabled.patchValue(false);
    // show tool tip for live toggle
    this.TooltipLiveDisabled.patchValue(false);
  }
  /**
   * disable weekend dates in datepicker
   * @param d
   * @returns every day of the week except saturday and sunday
   */
  weekendsDatesFilter = (d: Date): boolean => {
    const day = d.getDay();
    /* Prevent Saturday and Sunday for select. */
    return day !== 0 && day !== 6;
  };
  /**
   * set the value and style of mat-button-toggle-group based on datePickerValue
   * @param event
   */
  setToggles(event: MatDatepickerInputEvent<Date>) {
    // get value from datePicker formControl
    const datePickerValue = moment(event.value).format("YYYY-MM-DD");
    // set today date
    const today = moment(new Date()).format("YYYY-MM-DD");
    // set yesterday date
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    // last day in last month
    // for Example: if the current month is September, then beginMonth = 2021-08-31
    var beginMonth = moment(beginMonth)
      .subtract(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
    // get the last day of last week
    // for Example: if the current day is 24.09.2021, then lastDayOfLastWeek = 2021-09-18
    // we use both of variables to active toggle Woche
    const lastDayOfLastWeek = moment()
      .subtract(1, "weeks")
      .endOf("week")
      .format("YYYY-MM-DD");
    // set the value of mat-button-toggle-group based on Value of datePicker formControl
    if (datePickerValue === today) {
      // set selected toggle
      this.setColorAndBackground("toggleLive");
      // set unactive toggles
      this.setUnAtiveToggle("toggleTag", "toggleWoche");
      // remove hover effect from live, tag and woche toggles
      this.removeHandlerToggleWoche();
      this.removeHandlerToggleTag();
      this.removeHandlerToggleLive();
      // live is selected toggle in toggle-group
      this.selectedState = 0;
      // show content in second header
      this.showToggleSelected = "Live Performance";
      // tag toggle => not clickable
      this.disabledTag = true;
      // woche toggle => not clickable
      this.disabledWoche = true;
      // show tool tip for tag toggle
      this.TooltipTagDisabled.patchValue(false);
      // show tool tip for woche toggle
      this.TooltipWocheDisabled.patchValue(false);
    } else if (datePickerValue <= beginMonth) {
      // set selected and active toggles
      this.setColorAndBackground("toggleTag", "toggleLive", "toggleWoche");
      // tag is selected toggle in toggle-group
      this.selectedState = 1;
      // show content in second header
      this.showToggleSelected = "Tagesperformance";
      // live, tag and woche toggles => are clickable
      this.disabledLive = false;
      this.disabledTag = false;
      this.disabledWoche = false;
      // disable tool tip for tag and woche toggles
      this.TooltipTagDisabled.patchValue(true);
      this.TooltipWocheDisabled.patchValue(true);
      // add hover effect on live and woche toggles
      this.addHandlerToggleLive();
      this.addHandlerToggleWoche();
      // remove hover effect from tag toggle
      this.removeHandlerToggleTag();
      // if the current day is saturday or sunday
      if (this.dayNumber === 0 || this.dayNumber === 6) {
        // Live toggle => not clickable
        this.disabledLive = true;
        // set unactive toggle
        this.setUnAtiveToggle("toggleLive");
        // remove hover effect from live and tag toggles
        this.removeHandlerToggleLive();
        this.removeHandlerToggleTag();
        // add hover effect on woche toggle
        this.addHandlerToggleWoche();
      }
    } else if (moment(event.value).isBetween(beginMonth, lastDayOfLastWeek)) {
      // set selected and active toggles
      this.setColorAndBackground("toggleTag", "toggleLive", "toggleWoche");
      // tag is selected toggle in toggle-group
      this.selectedState = 1;
      // show content in second header
      this.showToggleSelected = "Tagesperformance";
      // live, tag and woche toggles => are clickable
      this.disabledLive = false;
      this.disabledTag = false;
      this.disabledWoche = false;
      // disable tool tip for tag and woche toggles
      this.TooltipTagDisabled.patchValue(true);
      this.TooltipWocheDisabled.patchValue(true);
      // add hover effect on live and woche toggles
      this.addHandlerToggleWoche();
      this.addHandlerToggleLive();
      // remove hover effect from tag toggle
      this.removeHandlerToggleTag();
      // if the current day is saturday or sunday
      if (this.dayNumber === 0 || this.dayNumber === 6) {
        // Live toggle => not clickable
        this.disabledLive = true;
        // set unactive toggle
        this.setUnAtiveToggle("toggleLive");
        // remove hover effect from live toggle
        this.removeHandlerToggleLive();
      }
    } else if (datePickerValue <= yesterday) {
      // set selected and active toggles
      this.setColorAndBackground("toggleTag", "toggleLive");
      // set unactive toggle
      this.setUnAtiveToggle("toggleWoche");
      // tag is selected toggle in toggle-group
      this.selectedState = 1;
      // show content in second header
      this.showToggleSelected = "Tagesperformance";
      // live, tag toggles => are clickable
      this.disabledLive = false;
      this.disabledTag = false;
      // woche toggle => not clickable
      this.disabledWoche = true;
      // disable tool tip for tag toggle
      this.TooltipTagDisabled.patchValue(true);
      // show tool tip for woche toggle
      this.TooltipWocheDisabled.patchValue(false);
      // add hover effect on live toggle
      this.addHandlerToggleLive();
      // remove hover effect from tag and woche toggles
      this.removeHandlerToggleWoche();
      this.removeHandlerToggleTag();
      // if the current day is saturday or sunday
      if (this.dayNumber === 0 || this.dayNumber === 6) {
        // set unactive toggle
        this.setUnAtiveToggle("toggleLive", "toggleWoche");
        // live toggle => not clickable
        this.disabledLive = true;
        // remove hover effect from live, tag and woche toggles
        this.removeHandlerToggleLive();
        this.removeHandlerToggleWoche();
        this.removeHandlerToggleTag();
      }
    }
  }
  /**
   * add hover to Toggle Woche
   * sets up functions mouseover and mouseout => that will be called whenever the specified event is delivered to the target
   */
  addHandlerToggleWoche() {
    document
      .getElementById("toggleWoche")
      .addEventListener("mouseover", this.mouseOverToggleWoche);
    document
      .getElementById("toggleWoche")
      .addEventListener("mouseout", this.mouseOutToggleWoche);
  }
  /**
   * remove hover to Toggle Woche
   * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
   */
  removeHandlerToggleWoche() {
    document
      .getElementById("toggleWoche")
      .removeEventListener("mouseover", this.mouseOverToggleWoche);
    document
      .getElementById("toggleWoche")
      .removeEventListener("mouseout", this.mouseOutToggleWoche);
  }
  /**
   * set background color when mouse hover
   */
  mouseOverToggleWoche() {
    document.getElementById("toggleWoche").style.background =
      "rgb(131 137 140)";
  }
  /**
   * set background color when mouse out
   */
  mouseOutToggleWoche() {
    document.getElementById("toggleWoche").style.background = "#0388c9";
  }
  /**
   * add hover to toggle Tag
   * sets up functions mouseover and mouseout => that will be called whenever the specified event is delivered to the target
   */
  addHandlerToggleTag() {
    document
      .getElementById("toggleTag")
      .addEventListener("mouseover", this.mouseOverToggleTag);
    document
      .getElementById("toggleTag")
      .addEventListener("mouseout", this.mouseOutToggleTag);
  }
  /**
   * remove hover to toggle Tag
   * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
   */
  removeHandlerToggleTag() {
    document
      .getElementById("toggleTag")
      .removeEventListener("mouseover", this.mouseOverToggleTag);
    document
      .getElementById("toggleTag")
      .removeEventListener("mouseout", this.mouseOutToggleTag);
  }
  /**
   * set background color when mouse hover
   */
  mouseOverToggleTag() {
    document.getElementById("toggleTag").style.background = "rgb(131 137 140)";
  }
  /**
   * set background color when mouse out
   */
  mouseOutToggleTag() {
    document.getElementById("toggleTag").style.background = "#0388c9";
  }
  /**
   * add hover to toggleLive
   * sets up functions mouseover and mouseout => that will be called whenever the specified event is delivered to the target
   */
  addHandlerToggleLive() {
    document
      .getElementById("toggleLive")
      .addEventListener("mouseover", this.mouseOverToggleLive);
    document
      .getElementById("toggleLive")
      .addEventListener("mouseout", this.mouseOutToggleLive);
  }
  /**
   * remove hover to toggleLive
   * removes from the EventTarget an event listener previously registered with EventTarget.addEventListener()
   */
  removeHandlerToggleLive() {
    document
      .getElementById("toggleLive")
      .removeEventListener("mouseover", this.mouseOverToggleLive);
    document
      .getElementById("toggleLive")
      .removeEventListener("mouseout", this.mouseOutToggleLive);
  }
  /**
   * set background color when mouse hover
   */
  mouseOverToggleLive() {
    document.getElementById("toggleLive").style.background = "rgb(131 137 140)";
  }
  /**
   * set background color when mouse out
   */
  mouseOutToggleLive() {
    document.getElementById("toggleLive").style.background = "#0388c9";
  }
  /**
   * set color and background
   * @param activeToggle
   * @param unActiveToggle1
   * @param unActiveToggle2
   */
  setColorAndBackground(
    activeToggle: string,
    unActiveToggle1?: string,
    unActiveToggle2?: string
  ) {
    // selected toggle
    if (activeToggle) {
      document.getElementById(activeToggle).style.background = "#e0e0e0";
      document.getElementById(activeToggle).style.color = "black";
    }
    // active toggle
    if (unActiveToggle1) {
      document.getElementById(unActiveToggle1).style.background = "#0388c9";
      document.getElementById(unActiveToggle1).style.color = "white";
    }
    // active toggle
    if (unActiveToggle2) {
      document.getElementById(unActiveToggle2).style.background = "#0388c9";
      document.getElementById(unActiveToggle2).style.color = "white";
    }
  }
  /**
   * Sets un ative toggle
   * @param unActiveToggle1
   * @param [unActiveToggle2]
   */
  setUnAtiveToggle(unActiveToggle1: string, unActiveToggle2?: string) {
    // unactive toggle
    if (unActiveToggle1) {
      document.getElementById(unActiveToggle1).style.background =
        "rgb(145 180 198)";
      document.getElementById(unActiveToggle1).style.color = "white";
    }
    // unactive toggle
    if (unActiveToggle2) {
      document.getElementById(unActiveToggle2).style.background =
        "rgb(145 180 198)";
      document.getElementById(unActiveToggle2).style.color = "white";
    }
  }
  /**
   * set the value of mat-button-toggle-group
   * @param $event
   */
  onChange($event: { value: any }) {
    this.selectedState = $event.value;
    if (this.selectedState === 0) {
      // update the datepicker value
      const today = moment(new Date()).format("YYYY-MM-DD");
      this.date.patchValue(today);
      // set selected toggle
      this.setColorAndBackground("toggleLive");
      // set unactive toggles
      this.setUnAtiveToggle("toggleTag", "toggleWoche");
      // show content in second header
      this.showToggleSelected = "Live Performance";
      // tag and woche toggles => not clickable
      this.disabledTag = true;
      this.disabledWoche = true;
      // show tool tip for tag and woche toggles
      this.TooltipTagDisabled.patchValue(false);
      this.TooltipWocheDisabled.patchValue(false);
      // remove hover effect from live, tag and woche toggles
      this.removeHandlerToggleLive();
      this.removeHandlerToggleWoche();
      this.removeHandlerToggleTag();
    } else if (this.selectedState === 1) {
      // set selected and active toggles
      this.setColorAndBackground("toggleTag", "toggleWoche");
      // show content in second header
      this.showToggleSelected = "Tagesperformance";
      // add hover effect on live and woche toggles
      this.addHandlerToggleWoche();
      this.addHandlerToggleLive();
      // remove hover effect from tag toggle
      this.removeHandlerToggleTag();
      // if the current day is saturday or sunday
      if (this.dayNumber === 0 || this.dayNumber === 6) {
        // set unactive toggle
        this.setUnAtiveToggle("toggleLive");
        // live toggle => not clickable
        this.disabledLive = true;
        // remove hover effect from live toggle
        this.removeHandlerToggleLive();
      }
    } else if (this.selectedState === 2) {
      let givenDate = moment(this.date.value);
      this.weeksInMonth(givenDate);
      // set selected and active toggles
      this.setColorAndBackground("toggleWoche", "toggleTag");
      // add hover effect on live and tag toggles
      this.addHandlerToggleTag();
      this.addHandlerToggleLive();
      // remove hover effect from woche toggle
      this.removeHandlerToggleWoche();
      // if the current day is saturday or sunday
      if (this.dayNumber === 0 || this.dayNumber === 6) {
        // set unactive toggle
        this.setUnAtiveToggle("toggleLive");
        // live toggle => not clickable
        this.disabledLive = true;
        // remove hover effect from live toggle
        this.removeHandlerToggleLive();
      }
    }
  }
  /**
   * Set date range
   * @param givenDate
   * @returns a range from monday to friday based on selected Date from datepickerFormControl
   */
  weeksInMonth(givenDate: moment.MomentInput) {
    // get dynamic month and year from datepickerFormControl
    let year = new Date(this.date.value).getFullYear();
    let month = new Date(this.date.value).getMonth();
    // First Week
    // calculate the First Week(saturday : sunday) based on dynamic month and year to use isBetween() method
    let firstDayInFirstWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(4, "weeks")
      .startOf("week");
    let lastDayInFirstWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(4, "weeks")
      .endOf("week");
    // calculate the First Week(monday : friday) based on dynamic month and year to view it, if datepickerFormControl value isBetween() (saturday : sunday)
    let mondayFirstWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(4, "weeks")
      .startOf("week")
      .add(1, "days")
      .format("DD/MM/YYYY");
    let fridayFirstWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(4, "weeks")
      .endOf("week")
      .subtract(1, "days")
      .format("DD/MM/YYYY");
    // Second Week
    //calculate the Second Week(saturday : sunday) based on dynamic month and year to use isBetween() method
    let firstDayInSecondWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(3, "weeks")
      .startOf("week");
    let lastDayInSecondWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(3, "weeks")
      .endOf("week");
    // calculate the Second Week(monday : friday) based on dynamic month and year to view it, if datepickerFormControl value isBetween() (saturday : sunday)
    let mondaySecondWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(3, "weeks")
      .startOf("week")
      .add(1, "days")
      .format("DD/MM/YYYY");
    let fridaySecondWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(3, "weeks")
      .endOf("week")
      .subtract(1, "days")
      .format("DD/MM/YYYY");
    // Third Week
    //calculate the Third Week(saturday : sunday) based on dynamic month and year to use isBetween() method
    let firstDayInThirdWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(2, "weeks")
      .startOf("week");
    let lastDAyInThirdWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(2, "weeks")
      .endOf("week");
    // calculate the Third Week(monday : friday) based on dynamic month and year to view it, if datepickerFormControl value isBetween() (saturday : sunday)
    let mondayThirdWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(2, "weeks")
      .startOf("week")
      .add(1, "days")
      .format("DD/MM/YYYY");
    let fridayThirdWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(2, "weeks")
      .endOf("week")
      .subtract(1, "days")
      .format("DD/MM/YYYY");
    // Forth Week
    //calculate the Forth Week(saturday : sunday) based on dynamic month and year to use isBetween() method
    let firstDayInFourthWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(1, "weeks")
      .startOf("week");
    let lastDAyInFourthWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(1, "weeks")
      .endOf("week");
    // calculate the Forth Week(monday : friday) based on dynamic month and year to view it, if datepickerFormControl value isBetween() (saturday : sunday)
    let mondayFourthWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(1, "weeks")
      .startOf("week")
      .add(1, "days")
      .format("DD/MM/YYYY");
    let fridayFourthWeek = moment([year, month, month === 1 ? 28 : 30])
      .subtract(1, "weeks")
      .endOf("week")
      .subtract(1, "days")
      .format("DD/MM/YYYY");
    // Fifth Week
    //calculate the Fifth Week(saturday : sunday) based on dynamic month and year to use isBetween() method
    let firstDayInFifthWeek = moment([
      year,
      month,
      month === 1 ? 28 : 30,
    ]).startOf("week");
    let lastDAyInFifthWeek = moment([year, month, month === 1 ? 28 : 30]).endOf(
      "week"
    );
    // calculate the Fifth Week(monday : friday) based on dynamic month and year to view it, if datepickerFormControl value isBetween() (saturday : sunday)
    let mondayFifthWeek = moment([year, month, month === 1 ? 28 : 30])
      .startOf("week")
      .add(1, "days")
      .format("DD/MM/YYYY");
    let fridayFifthWeek = moment([year, month, month === 1 ? 28 : 30])
      .endOf("week")
      .subtract(1, "days")
      .format("DD/MM/YYYY");
    if (moment(givenDate).isBetween(firstDayInFirstWeek, lastDayInFirstWeek)) {
      this.showToggleSelected =
        "Wochenperformance  " +
        "  " +
        `${mondayFirstWeek}` +
        " - " +
        `${fridayFirstWeek}`;
      return this.showToggleSelected;
    } else if (
      moment(givenDate).isBetween(firstDayInSecondWeek, lastDayInSecondWeek)
    ) {
      this.showToggleSelected =
        "Wochenperformance  " +
        "  " +
        `${mondaySecondWeek}` +
        " - " +
        `${fridaySecondWeek}`;
      return this.showToggleSelected;
    } else if (
      moment(givenDate).isBetween(firstDayInThirdWeek, lastDAyInThirdWeek)
    ) {
      this.showToggleSelected =
        "Wochenperformance  " +
        "  " +
        `${mondayThirdWeek}` +
        " - " +
        `${fridayThirdWeek}`;
      return this.showToggleSelected;
    } else if (
      moment(givenDate).isBetween(firstDayInFourthWeek, lastDAyInFourthWeek)
    ) {
      this.showToggleSelected =
        "Wochenperformance  " +
        "  " +
        `${mondayFourthWeek}` +
        " - " +
        `${fridayFourthWeek}`;
      return this.showToggleSelected;
    } else if (
      moment(givenDate).isBetween(firstDayInFifthWeek, lastDAyInFifthWeek)
    ) {
      this.showToggleSelected =
        "Wochenperformance  " +
        "  " +
        `${mondayFifthWeek}` +
        " - " +
        `${fridayFifthWeek}`;
      return this.showToggleSelected;
    }
  }
}
// An enum is a special "class" that represents a group of constants
// Live has the value 1, Tag has 2 and Woche has 3.
export enum ToggleEnum {
  Live,
  Tag,
  Woche,
}
