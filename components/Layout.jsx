import Link from 'next/link';
import {Button} from 'antd';
import Router from 'next/router';

export default ({ children }) => {
    function click() {
        Router.push({
          pathname: '/a',
          query: {
            id: 4
          }
        }, "/a/4");
      }
    return (
        <div>
            <header>
                <Button onClick={click}>aaa</Button>
                <Link href="/a?id=2" as="/a/2">
                    <Button>Click2</Button>
                </Link>
            </header>
            {children}
        </div>
        
    )
}