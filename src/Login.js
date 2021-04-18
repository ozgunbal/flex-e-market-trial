import { useState } from "react";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm, Controller } from "react-hook-form";

import "./App.css";
import { signIn, setToken } from "./api";

function App() {
  const history = useHistory();
  const [authError, setAuthError] = useState("");

  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      password: "",
      email: "",
      account: ""
    }
  });
  const submit = async ({ account, email, password }) => {
    try {
      const data = await signIn({ username: `${account}|${email}`, password });
      setToken(data.token);
      history.push("/dashboard", {
        personId: data.person.id,
        person: data.person
      });
    } catch (error) {
      setAuthError(error.message);
    }
  };
  console.log(errors);
  return (
    <div className="App">
      <header className="App-header">
        <h2>Flex E-Market Experiment</h2>
        <form
          onSubmit={handleSubmit(submit)}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Controller
            name="account"
            control={control}
            rules={{ required: "Required field" }}
            render={({ onChange, value }) => (
              <TextField
                style={{ margin: "10px 0" }}
                label="Account"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!errors.account}
                helperText={errors.account && errors.account.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: "Required field" }}
            render={({ onChange, value }) => (
              <TextField
                style={{ margin: "10px 0" }}
                label="E-mail"
                variant="outlined"
                value={value}
                onChange={onChange}
                error={!!errors.email}
                helperText={errors.email && errors.email.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Required field" }}
            render={({ onChange, value }) => (
              <TextField
                style={{ margin: "10px 0" }}
                label="Password"
                variant="outlined"
                type="password"
                value={value}
                onChange={onChange}
                error={!!errors.password}
                helperText={errors.password && errors.password.message}
              />
            )}
          />
          {authError ? <div style={{ color: "red" }}>Login failed.</div> : null}

          <Button variant="contained" color="primary" type="submit">
            SIGN IN
          </Button>
        </form>
      </header>
    </div>
  );
}

export default App;
