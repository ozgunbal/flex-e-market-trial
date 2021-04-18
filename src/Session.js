import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const Session = ({ sessions }) => {
  return sessions ? (
    <Card style={{ margin: 10 }}>
      <CardContent>
        <Typography ccolor="textSecondary" gutterBottom>
          Session Count: {sessions.length}
        </Typography>
        <Typography color="textSecondary">
          {sessions.filter((ses) => ses.state === "CLOSED").length} session(s)
          CLOSED
        </Typography>
        <Typography variant="h5">
          {sessions.filter((ses) => ses.state === "OPEN").length} session OPEN
        </Typography>
      </CardContent>
    </Card>
  ) : null;
};

export default Session;
