import { Outlet } from "react-router-dom";

export const DefaultLayout: React.FC = () => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Room", path: "/room/0" },
  ];

  return (
    <>
      <header>
        <nav className="bg-gray-800 p-8 flex justify-between">
          <ul className="flex gap-8">
            {links.map(({ name, path }) => (
              <a
                key={path}
                href={path}
                className="text-white font-mono text-xl"
              >
                {name}
              </a>
            ))}
          </ul>
          <ul>
            <li>
              <a href="" className="text-white font-mono text-xl">
                Signin
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default DefaultLayout;
