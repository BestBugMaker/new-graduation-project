import {connect} from 'react-redux'
import Index from '../pages/index'
import Router from 'next/router';

export default function (Comp) {
    function RouterGuard({ pageData, user }) {
        console.log("user", user)
        if(user && user.id) {
            return(
                <Comp {...pageData} />
            )
        }else {
            return(
                <Index />
            )
        }
    }
    
    RouterGuard.getInitialProps = async (context) => {
        let pageData = {}
        if(Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }
        console.log("pageData", pageData)
        // if(!user || !user.id) {
        //     return {
        //         isLogined: false
        //     }
        // }
        return {
            pageData
        }
        // console.log(user)
    }
    
    return connect(function(state) {
        return {
            user: state.user
        }
    })(RouterGuard)
}

