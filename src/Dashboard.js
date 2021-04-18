import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { useForm, Controller } from "react-hook-form";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "./App.css";
import { getMarketData, getSessions } from "./api";
import Holding from "./Holding";
import Sessions from "./Session";
import valuationData from "./data.json";

const today = new Date(new Date().setHours(0, 0, 0));

function App() {
  const history = useHistory();
  const { state } = useLocation();
  const [holdings, setHoldings] = useState();
  const [sessions, setSessions] = useState();
  const [valuations, setValuations] = useState();
  const [openSessionIndex, setOpenSessionIndex] = useState();
  const [isMoveNext, setIsMoveNext] = useState();

  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      startDate: today,
      marketplaceId: ""
    }
  });

  const getData = async ({ marketplaceId, startDate }) => {
    setIsMoveNext(false);
    const sessionData = await getSessions(marketplaceId);
    const filteredSessions = sessionData
      .filter(
        (data) => new Date(data.createdDate).getTime() > startDate.getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.createdDate).getTime() > new Date(b.createdDate).getTime()
      );
    const sessionIds = filteredSessions.map((session) => session.id);

    const holdingsData = await getMarketData(marketplaceId);
    const filtered = holdingsData
      .filter((holding) => holding.owner.id === state.personId)
      .filter((holding) => sessionIds.includes(holding.session.id));
    setHoldings(filtered);
    setSessions(filteredSessions);
    setOpenSessionIndex(filteredSessions.length - 1);
    setValuations(
      valuationData[marketplaceId][state.person.email][
        filteredSessions.length - 1
      ] || []
    );

    const isAllClosed = filteredSessions.every((ses) => ses.state === "CLOSED");
    setIsMoveNext(filteredSessions.length > 4 && isAllClosed);
  };

  useEffect(() => {
    if (!state) {
      history.push("/");
    }
  }, [state, history]);

  const marketPlaces = Object.keys(valuationData).filter((id) =>
    Object.keys(valuationData[id]).includes(state.person.email)
  );

  return (
    <div className="App">
      <header className="App-header">
        <form
          onSubmit={handleSubmit(getData)}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Controller
            name="marketplaceId"
            control={control}
            rules={{ required: "Required field" }}
            render={({ onChange, value }) => (
              <FormControl error={errors.marketplaceId}>
                <InputLabel id="demo-simple-select-filled-label">
                  Marketplace ID
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={value}
                  onChange={onChange}
                >
                  {marketPlaces.map((market) => (
                    <MenuItem value={market}>{market}</MenuItem>
                  ))}
                </Select>
                {errors.marketplaceId ? (
                  <FormHelperText>
                    {errors.marketplaceId.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Controller
              name="startDate"
              control={control}
              render={({ onChange, value }) => (
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Experiment Date"
                  value={value}
                  onChange={onChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              )}
            />
          </MuiPickersUtilsProvider>
          <Button variant="contained" color="primary" type="submit">
            {holdings ? "ReSend" : "Send"}
          </Button>
        </form>
        <Sessions sessions={sessions} />
        {holdings ? (
          holdings.length ? (
            <div style={{ padding: 5 }}>
              <p>Holdings:</p>
              <ul>
                {holdings.map((holding) => {
                  const cashDifference = Math.abs(
                    holding.cash - holding.capital.cash
                  );
                  return (
                    <Holding
                      key={holding.owner.createdDate}
                      data={holding}
                      cashDifference={cashDifference}
                      valuations={
                        openSessionIndex >= 0 ? valuations : undefined
                      }
                    />
                  );
                })}
              </ul>
            </div>
          ) : (
            <div>There's no holding</div>
          )
        ) : null}
        {isMoveNext > 4 ? <div>Move to next market </div> : null}
      </header>
    </div>
  );
}

export default App;
