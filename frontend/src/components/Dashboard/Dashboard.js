import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Button, Card, Grid2, CardContent, Typography } from "@mui/material";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";

const Dashboard = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  //get total expenses
  const [totalBalance, setTotalBalance] = React.useState(0);
  const [totalExpenses, setTotalExpenses] = React.useState(0);
  const [recentTransactions, setRecentTransactions] = React.useState([]);

  //get recent trnsactions
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions/transactions/recent")
      .then((response) => {
        setRecentTransactions(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the recent transactions!", error);
      });
  }, []);

  //get total balance
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions/transactions/total_balance")
      .then((response) => {
        setTotalBalance(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the total balance!", error);
      });
  }, []);

  //get total expenses
  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions/transactions/total_expenses")
      .then((response) => {
        setTotalExpenses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the total expenses!", error);
      });
  }, []);

  const navigate = useNavigate();  

  const [lineData, setLineData] = React.useState({
    labels: [],
    datasets: [
      {
        label: "Income",
        data: [],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Expenses",
        data: [],
        borderColor: "red",
        fill: false,
      },
    ],
  });

  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions")
      .then((response) => {
        const labels = response.data.map(item => new Date(item.date).toLocaleDateString());
        const incomeData = response.data.filter(item => item.type === 'income').map(item => item.amount);
        const expensesData = response.data.filter(item => item.type === 'expense').map(item => item.amount);
        setLineData({
          labels: labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              borderColor: "green",
              fill: false,
            },
            {
              label: "Expenses",
              data: expensesData,
              borderColor: "red",
              fill: false,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the income and expenses summary!", error);
      });
  }, []);

  const [pieData, setPieData] = React.useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  });

  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/transactions")
      .then((response) => {
        const categories = response.data.map(item => item.category);
        const amounts = response.data.map(item => item.amount);
        setPieData({
          labels: categories,
          datasets: [
            {
              data: amounts,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the category summary!", error);
      });
  }, []);

  const handleTransactions = () => {
    navigate("/transactions");
  };
  return (
    <div className="dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            marginRight: "10px",
            backgroundColor: "#4bcbeb",
            color: "#fff",
          }}
          onClick={handleTransactions}
        >
          Transactions
        </Button>
        <Button
          className=""
          variant="contained"
          sx={{ backgroundColor: "#1BCFB4", color: "#fff" }}
        >
          Category
        </Button>
      </div>

      <div style={{ margin: "20px" }}>
        <Grid2 container spacing={2} minHeight={120}>
          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            size="grow"
          >
            <Card
              style={{
                background: "#e3e3e3",
                height: "100%",
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Balance
                </Typography>
                <Typography variant="h4" color="primary">
                  ${totalBalance}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            size="grow"
          >
            <Card
              style={{
                background: "#e3e3e3",
                height: "100%",
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Expenses Summary
                </Typography>
                <Typography variant="h4" color="error">
                  ${totalExpenses}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            size="grow"
          >
            <Card
              style={{
                background: "#e3e3e3",
                height: "100%",
                width: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Recent Transactions
                </Typography>
                <ul>
                  {recentTransactions.map((transaction) => (
                    <li key={transaction.id}>
                      {transaction.category}: ${transaction.amount}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </div>
      <div style={{ margin: "20px", marginTop: "30px" }}>
        <Grid2 container spacing={2}>
          <Grid2 size={8}>
            <Card>
              <Typography variant="h6" color="textSecondary">
                Income vs Expenses
              </Typography>
              <Line data={lineData} />
            </Card>
          </Grid2>
          <Grid2 size={4}>
            <Card>
              <Typography variant="h6" color="textSecondary">
                Category of Expenses
              </Typography>
              <Pie data={pieData} />
            </Card>
          </Grid2>
        </Grid2>
      </div>
    </div>
  );
};

export default Dashboard;
