import { Fragment, useEffect, useMemo, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getCurrentUser } from '../../store/users';

function Lists(props) {
    const [giftList, setGiftList] = useState([]);
    const [user] = useSelector(getCurrentUser(props.userId));

    useEffect(() => {
        async function getGroups() {
            try {
                const groups = await user.groups;
                const [group] = groups.filter(group => group.name === user.currentGroup);
                setGiftList(group.giftList);
            } catch (error) {
                console.log(error.message)
            }
        }
        getGroups();
    }, [user, giftList])

    /* 
     if(personToGift) {
            const person = getUser(personToGift.email);
            const groupIndex = person.groups.findIndex(group => group.name === this.state.user.currentGroup);
            const personGiftList = person.groups[groupIndex].giftList;
        }
    */

    const categories = useMemo(() =>
    ({
        'My List': giftList ? giftList : [
            {
                id: 1,
                title: 'My Gift 1 name',
                data: 'Gift 1 link',
                link: '/'
                // image: internationalLunch,
            },
            {
                id: 2,
                title: 'My Gift 2 name',
                data: 'Gift 2 link',
                link: '/'
                // image: internationalLunch,
            },
            {
                id: 3,
                title: 'My Gift 3 name',
                data: 'Gift 3 link',
                link: '/'
                // image: internationalLunch,
            },
        ],
        'Person List': [
            {
                id: 1,
                title: 'Person Gift 1 name',
                data: 'Gift 1 link',
                link: '/'
                // image: internationalLunch,
            },
            {
                id: 2,
                title: 'Person Gift 2 name',
                data: 'Gift 2 link',
                link: '/'
                // image: internationalLunch,
            },
            {
                id: 3,
                title: 'Person Gift 3 name',
                data: 'Gift 3 link',
                link: '/'
                // image: internationalLunch,
            },
        ],
    })
        , [giftList])

    const handleLoadGifts = async () => {
        try {
            const groups = await user.groups;
            const [group] = groups.filter(group => group.name === user.currentGroup);
            setGiftList(group.giftList);
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDelete = name => {
        console.log(name)
        // generate random ids for gifts
    }


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="w-[75%] !mt-0">
            <Tab.Group>

                <h2 className='text-3xl text-center'>{props.title}</h2>

                <Tab.List className="flex space-x-1 rounded-md bg-black p-1">
                    {Object.keys(categories).map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-md py-2 text-sm font-medium leading-5 text-black',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-black focus:outline-none focus:ring-2',
                                    selected ? 'bg-white shadow text-black' : 'text-white hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels className="flex m-3 bg-half-black rounded-md p-1 py-2 xl:outline-8 xl:outline-double xl:outline-gray-500">

                    {Object.values(categories).map((category, idx) => (
                        <Tab.Panel key={idx} className={'w-full'}>

                            <ul className="space-y-3">

                                {category && category.map((info) => (
                                    <li
                                        key={info._id || info.id || info.name}
                                        className={`relative rounded-md ${!info.image ? 'bg-white' : ''} flex border`}
                                    >

                                        <div
                                            className={`${info.image ? 'absolute' : ''
                                                } top-1 right-2 bg-clear-white w-fit p-1 rounded-md`}
                                        >
                                            {!info.image && (
                                                <Fragment>
                                                    <NavLink to={info.link} className="text-md font-medium leading-5 font-bold">{info.name}</NavLink>
                                                    <ul className="mt-1 flex space-x-1 text-sm leading-4 text-gray-900">
                                                        <li>{info.link}</li>
                                                    </ul>
                                                </Fragment>
                                            )}
                                        </div>

                                        <button onClick={() => handleDelete(info.name)} className='ml-auto bg-red-200 text-red-600 rounded-full h-fit p-2 py-0.5 self-center mr-3 shadow-sm border hover:bg-red-400 hover:text-black hover:border-black hover:shadow-black'>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
            <button onClick={handleLoadGifts} className='bg-neutral-400 p-2 py-1 rounded ml-auto block mt-5 mr-4 ring-2 ring-neutral-50 ring-offset-4 outline outline-2 outline-neutral-50 outline-offset-2 shadow shadow-lg shadow-transparent border border-black hover:ring-black hover:outline-green-600 hover:shadow-green-700 hover:border-transparent' >Load Gifts</button>

        </div>
    );

}

export default Lists;