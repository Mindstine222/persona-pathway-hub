import MBTIBarChart from "@/components/MBTIBarChart";

const ChartTest = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">MBTI Chart Test</h1>
            <MBTIBarChart
                scores={{
                    E: 60,
                    I: 40,
                    S: 55,
                    N: 45,
                    T: 70,
                    F: 30,
                    J: 65,
                    P: 35,
                }}
            />
        </div>
    );
};

export default ChartTest;
