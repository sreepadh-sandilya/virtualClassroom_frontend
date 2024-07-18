export default function LoadingScreen() {
    return (
        <div className="h-[100vh] flex flex-1 justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#cc4949]"></div>
                <p className="text-lg font-semibold mt-4">Loading...</p>
            </div>
        </div>
    );
}