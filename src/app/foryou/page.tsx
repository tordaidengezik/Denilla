import SideMenu from '../sidemenu/page';
import TopMenu from '../topmenu/page';


export default function Layout() {

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <SideMenu/>
      <main className="w-full md:w-2/4 h-2/4 md:h-full overflow-y-scroll bg-customBg border-l border-r border-gray-300">
        <TopMenu />
        
        <div className="p-4">
          <p>hello szia</p>
        </div>
      </main>

      <nav className="w-full md:w-1/4 h-1/4 md:h-full p-4 overflow-auto bg-customBg">
        <p>szia hello</p>
      </nav>


    </div>
  );
}