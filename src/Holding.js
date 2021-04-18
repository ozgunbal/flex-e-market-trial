import { useState } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const Asset = ({ data, cashDifference, valuations }) => {
  const role = data.grant.canBuy ? "BUYER" : "SELLER";
  const unitDifference = Math.abs(data.units - data.grant.units);
  const moneySpent =
    unitDifference > 0 && valuations
      ? valuations.slice(0, unitDifference).reduce((a, b) => a + b)
      : 0;
  let profit;
  if (role === "BUYER") {
    profit = moneySpent - cashDifference / 100;
  } else {
    profit = cashDifference / 100 - moneySpent;
  }
  return valuations ? (
    <p>Profit: {profit.toFixed(2)}</p>
  ) : (
    <p>Couldn't find valuations</p>
  );
};

const Holding = ({ data, cashDifference, valuations }) => {
  const [show, setShow] = useState(false);
  return (
    <Card
      style={{ padding: 10, cursor: "pointer", minWidth: 300 }}
      onClick={() => setShow((x) => !x)}
    >
      Cash
      {show ? (
        <>
          <Typography color="textSecondary">
            Owner : {data.owner.firstName} {data.owner.lastName}
            <br />
            Session is {data.session.state}
            <br />
            MarketPlace: {data.marketplace.name}
            <br />
            <br />
          </Typography>
          <p>
            {data.assets.map((asset) => (
              <Asset
                data={asset}
                cashDifference={cashDifference}
                valuations={valuations}
              />
            ))}
          </p>
        </>
      ) : null}
    </Card>
  );
};

export default Holding;
