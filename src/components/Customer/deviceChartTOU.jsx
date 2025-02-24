import { React, useState, useEffect } from "react";
import "../../assets/css/Customer/deviceCharttou.css";
import { Pie } from "react-chartjs-2";
import Axios from "axios";

export default function DeviceChart() {
  const params = new URLSearchParams(window.location.search);
  const calculatedBillId = params.get("bill_id");

  const [appliance, setAppliance] = useState([]);
  const [colors1, setColors1] = useState([]);
  const [colors2, setColors2] = useState([]);
  const [peakUnits, setPeakUnits] = useState([]);
  const [offPeakUnits, setOffPeakUnits] = useState([]);
  const [dayUnits, setDayUnits] = useState([]);
  const [peakCost, setPeakCost] = useState([]);
  const [offPeakCost, setOffPeakCost] = useState([]);
  const [dayCost, setDayCost] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  async function getDeviceDetailsTOU(newBillId) {
    var ParamsUserId = document.cookie
      .split(";")
      .map((cookie) => cookie.split("="))
      .reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [key.trim()]: decodeURIComponent(value),
        }),
        {}
      ).userId;

    var token = document.cookie
      .split(";")
      .map((cookie) => cookie.split("="))
      .reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [key.trim()]: decodeURIComponent(value),
        }),
        {}
      ).token;

    // let History = useHistory();
    console.log("call device detail function");

    const response = await Axios.post(
      `${process.env.REACT_APP_BASE_URL}/get-device-wise-usage-tou-main/${ParamsUserId}`,
      {
        newBillId: newBillId,
      },
      {
        headers: {
          authorization: `Token ${token}`,
        },
      }
    );

    console.log(response.data.data);
    return response.data.data;
  }

  function generateColor1() {
    var symbols, color;
    symbols = "0123456789ABCDEF";
    color = "#";

    for (var i = 0; i < 6; i++) {
      color = color + symbols[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function generateColor2() {
    var symbols, color;
    symbols = "ABCDEF0123456789";
    color = "#";

    for (var i = 0; i < 6; i++) {
      color = color + symbols[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getData(chartData) {
    var i;
    var applianceList = [];
    let colorList1 = [];
    let colorList2 = [];
    var peakUnitList = [];
    var offPeakUnitList = [];
    var dayUnitList = [];
    var peakCostList = [];
    var offPeakCostList = [];
    var dayCostList = [];
    var totalCost = [];
    var totalUnit = [];

    for (i = 0; i < chartData.length; i++) {
      applianceList.push(chartData[i].appliance);
      colorList1.push(generateColor1());
      colorList2.push(generateColor2());
      peakUnitList.push(chartData[i].units_peak_time);
      offPeakUnitList.push(chartData[i].units_off_peak_time);
      dayUnitList.push(chartData[i].units_day_time);
      peakCostList.push(chartData[i].cost_peak_time);
      offPeakCostList.push(chartData[i].cost_off_peak_time);
      dayCostList.push(chartData[i].cost_day_time);
      totalCost.push(chartData[i].total_cost_TOU);
      totalUnit.push(chartData[i].total_units);
    }

    setAppliance(applianceList);
    setColors1(colorList1);
    setColors2(colorList2);
    setPeakUnits(peakUnitList);
    setOffPeakUnits(offPeakUnitList);
    setDayUnits(dayUnitList);
    setPeakCost(peakCostList);
    setOffPeakCost(offPeakCostList);
    setDayCost(dayCostList);
    setTotalUnits(totalUnit);
    setTotalCost(totalCost);
  }

  useEffect(async () => {
    var devices_data_fixed = await getDeviceDetailsTOU(calculatedBillId);
    await getData(devices_data_fixed);
    console.log(devices_data_fixed);
    console.log(appliance);
    console.log(peakUnits);
  }, []);

  return (
    <div>
      <h2
        className="MainTitle-tou text-center"
        style={{ marginBottom: "2rem" }}
      >
        <b> DEVICE WISE USAGE - TOU </b>
      </h2>
      <div class="row row-tou">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">
                Total Cost Usage (LKR/month)
              </h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body chartbody">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: totalCost,
                              backgroundColor: colors1,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Total Unit Usage (kWh)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: totalUnits,
                              backgroundColor: colors2,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h5 className="SubTitle-tou">
        <b> Peak Time </b>
      </h5>
      <div class="row row-tou">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Cost Usage (LKR/month)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body chartbody">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: peakCost,
                              backgroundColor: colors1,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Unit Usage (kWh)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: peakUnits,
                              backgroundColor: colors2,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h5 className="SubTitle-tou">
        <b> Off Peak Time </b>
      </h5>
      <div class="row row-tou">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Cost Usage (LKR/month)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body chartbody">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: offPeakCost,
                              backgroundColor: colors1,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Unit Usage (kWh)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: offPeakUnits,
                              backgroundColor: colors2,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h5 className="SubTitle-tou">
        <b> Day Time </b>
      </h5>
      <div class="row row-tou">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Cost Usage (LKR/month)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body chartbody">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: dayCost,
                              backgroundColor: colors1,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-title text-center">Unit Usage (kWh)</h6>
              <div class="col-sm-12">
                <div class="card chart-tou">
                  <div class="card-body">
                    <div className="chart-devicewise">
                      <Pie
                        data={{
                          labels: appliance,
                          datasets: [
                            {
                              data: dayUnits,
                              backgroundColor: colors2,
                              hoverOffset: 4,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
