
export default function Footer(props) {
  return (
    <>
      <footer className="px-5 mt-20 w-full flex flex-col items-center pb-12 lg:h-[374px] md:justify-center">
        <div className="mt-8 flex flex-col md:flex-row items-center gap-8 md:gap-[34px]">
          <a className="font-bold text-moon-white tracking-wide hover:scale-105" href="#">Link 1</a>
          <a className="font-bold text-moon-white tracking-wide hover:scale-105" href="#">Link 2</a>
          <a className="font-bold text-moon-white tracking-wide hover:scale-105" href="#">Link 3</a>
          <a className="font-bold text-moon-white tracking-wide hover:scale-105" href="#">Link 4</a>
        </div>
        <p className="mt-11 text-center font-light text-moon-white opacity-50 text-sm tracking-wider">Copyright
        </p>
      </footer>
    </>
  )
}