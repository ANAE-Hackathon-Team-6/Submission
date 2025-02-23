import EcommerceMetrics from "../../components/submissions/UserMetrics";
import MonthlySalesChart from "../../components/submissions/MonthlySubmissions";
import StatisticsChart from "../../components/submissions/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | ANAE - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for Anae - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="flex flex-col w-full gap-4">
        <div className="col-span-12 space-y-6 ">
          <EcommerceMetrics />
        </div>

        <div className="flex flex-row w-full gap-4">
          <div className="flex-1">
            <MonthlySalesChart />
          </div>
          <div className="flex-1">
            <StatisticsChart />
          </div>
        </div>
      </div>
    </>
  );
}
