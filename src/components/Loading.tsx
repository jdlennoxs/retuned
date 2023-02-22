export default function Loading() {
  return (
    <>
      <div className="absolute -m-52 flex h-screen w-screen">
        <div className="relative m-auto place-items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="m-4 h-48 w-48 animate-bounce-slow"
          >
            <path
              strokeLinecap="round"
              stroke="#8f83d8"
              strokeLinejoin="round"
              d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
            />
          </svg>
        </div>
      </div>
      <div className="fixed bottom-16 text-center">
        <h1 className="text-lg font-semibold text-white">Loading...</h1>
      </div>
    </>
  );
}
