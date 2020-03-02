import { Select, Spin } from 'antd'
import { useState, useCallback, useRef } from 'react'
import api from '../lib/api'
import debounce from 'lodash/debounce'
const Option = Select.Option

function SearchUser({ onChange, value }) {
    //{current: 0}
    const lastFetchIdRef = useRef(0)
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])

    //500ms没有变化后才会执行方法
    const fetchUser = useCallback(debounce(value => {
        console.log('fetching user', value)
        lastFetchIdRef.current += 1
        const fetchId = lastFetchIdRef.current
        setFetching(true)
        setOptions([])
        api.request({
            url: `/search/users?q=${value}`
        }).then(resp => {
            console.log('user:', resp)
            if(fetchId !== lastFetchIdRef.current){
                return
            }
            const data = resp.data.items.map(user => ({
                text: user.login,
                value: user.login
            }))

            console.log('data', data)
            setFetching(false)
            setOptions(data)
        })
    }, 500), [])

    let handleChange = (value) => {
        setOptions([])
        setFetching(false)
        onChange(value)
    }
    return (
        <Select 
            style={{ width: 200 }}
            showSearch={true} 
            notFoundContent={fetching? <Spin size="small" ></Spin>: <span>nothing</span>}
            filterOption={false}
            placeholder="创建者"
            value = {value}
            onChange={handleChange}
            onSearch={fetchUser}
            allowClear={true}
        >
            {
                options.map(op => (
                    <Option value={op.value} key={op.value}>{ op.text }</Option>
                ))
            }

        </Select>
    )
}

export default SearchUser