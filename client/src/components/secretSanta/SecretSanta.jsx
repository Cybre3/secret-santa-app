// secret santa name - DONE
// secret santa gift list - my list - DONE
// gift priority // sort function - sort by number
// person assignment - DONE
// access to person assigned gift list - DONE
// gift selection - DONE
// Render gift in list - DONE

import React from 'react';
import Joi from 'joi-browser';
import { connect } from 'react-redux';

import withRouter from '../../utilities/withRouter';
import { addGiftToUser, getCurrentUser, getCurrentUserByEmail, loadUsers } from '../../store/users';
import { assignPersonToUser, getGroup, loadGroups, removePersonFromPickPool } from '../../store/groups';

import Form from '../common/form/Form';
import Lists from './ListToggle';
import ChooseGroup from './ChooseGroup';

class SecretSanta extends Form {
    state = {
        data: {
            name: '',
            link: '',
            priority: 0
        },
        personToGift: {},
        user: {},
        chooseBtnVisible: false,
        group: '',
        errors: {}
    }

    async componentDidMount() {
        const { id: userId } = this.props.params;
        await this.props.loadUsers();
        await this.props.loadGroups();
        const [storeCurrentUser] = await this.props.currentUser(userId);
        const groupIndex = storeCurrentUser.groups.findIndex(group => group.name === storeCurrentUser.currentGroup);
        const personToGift = storeCurrentUser.groups[groupIndex].personToGift;

        this.setState({ user: storeCurrentUser })
        if (storeCurrentUser.currentGroup) this.setState({ group: storeCurrentUser.currentGroup })
        if (personToGift) this.setState({ personToGift })
    }

    schema = {
        name: Joi.string().allow('').label('Gift Name'),
        link: Joi.string().allow('').label('Gift Link'),
        priority: Joi.number().allow('').label('Gift Priority'),
    }

    priorityOptions = [
        { id: 1, name: 'priority', value: 1 },
        { id: 2, name: 'priority', value: 2 },
        { id: 3, name: 'priority', value: 3 }
    ];

    inputClasses = {
        inputContainer: 'flex justify-between space-x-2 w-full',
        inputClass: 'rounded-sm outline outline-1 pl-3 py-1 tx-sm w-[70%]',
        labelClass: 'text-white'
    };

    dropdownClasses = {
        inputContainer: 'flex justify-between space-x-2 w-full',
        inputClass: 'rounded-sm outline outline-1 tx-sm w-[20%] text-center !mr-20',
        labelClass: 'text-white'
    };

    btnClass = 'cursor-pointer rounded border border-black my-4 px-4 py-1 hover:bg-green-700 hover:text-white bg-white';

    handleAssignPerson = async () => {
        const { user } = this.state;
        const [{ pickPool, secretSantas }] = await this.props.getGroup(user.currentGroup)

        const pickPoolFiltered = pickPool.filter(person => person.email !== user.email);
        const randomIndex = Math.floor(Math.random() * pickPoolFiltered.length);
        const personToGift = pickPoolFiltered[randomIndex];
        const santa = secretSantas.find(person => person.email === personToGift.email);

        await this.props.assignPersonToUser(user, personToGift);
        await this.props.removePersonFromPickPool(personToGift, user.currentGroup);
        this.setState({ personToGift: santa });
    }

    handleChooseGroup = () => {
        this.setState({ chooseBtnVisible: this.state.chooseBtnVisible ? false : true });
    }

    handleSetVisible = boolean => {
        this.setState({ chooseBtnVisible: boolean })
    }

    doSubmit = async () => {
        this.props.addGift(this.props.params.id, this.state.data, await this.state.group);
        this.setState({ data: { name: '', link: '', priority: 0 } });
    }

    render() {
        const { user, personToGift, chooseBtnVisible } = this.state;

        return (
            <div className='w-screen h-screen overflow-hidden bg-green-800 flex items-center'>

                <div className='mx-auto py-6 h-full w-[50%] flex flex-col bg-neutral-50 rounded space-y-10 items-center border border-black border-2 shadow-md shadow-white'>

                    <div className='w-full flex justify-around mb-4'>
                        <h3>Secret Santa: {user ? user.firstname : ''}</h3>
                        {
                            chooseBtnVisible ?
                                <ChooseGroup visible={chooseBtnVisible} setVisible={this.handleSetVisible} /> :
                                (
                                    <div>
                                        {
                                            user.currentGroup ?
                                                <p
                                                    onClick={() => this.setState({ chooseBtnVisible: true })}
                                                    className='hover:underline hover:cursor-pointer hover:text-red-600'
                                                >
                                                    {user.currentGroup}
                                                </p>
                                                :
                                                <button className='bg-neutral-300 p-2 py-1 border border-black rounded-md' onClick={this.handleChooseGroup}>Choose Group</button>
                                        }

                                    </div>
                                )
                        }
                        <div className='flex space-x-4'>
                            {
                                !personToGift.email &&
                                <button
                                    onClick={this.handleAssignPerson}
                                    className='bg-white border-2 border-green-600 rounded-md px-2 py-1 hover:bg-green-600 hover:text-white hover:border-black'
                                >
                                    Assign Person
                                </button>
                            }
                            <h3>Gift to: {personToGift.firstname}</h3>
                        </div>
                    </div>

                    {user ? <Lists title={'Lists'} userId={this.props.params.id} /> : null}

                    <form name='add-to-gift-list' onSubmit={this.handleSubmit} className='border-2 border-black rounded p-4 px-6 bg-green-600 absolute bottom-4'>

                        <div className='text-center mb-6 text-white'>
                            <h2 className='font-bold text-lg uppercase'>Add Gift To My List</h2>
                            <p className='text-sm'>You can copy and paste from the site</p>
                        </div>

                        <div className='space-y-4'>
                            {this.renderInput('name', 'Gift Name', '', '', this.inputClasses)}
                            {this.renderInput('link', 'Gift Link', '', '', this.inputClasses)}
                            {this.renderDropdown('priority', 'Gift Priority', this.priorityOptions, this.dropdownClasses)}

                            {this.renderButton('Add to my List', '', 'text-center', this.btnClass)}
                        </div>

                    </form>

                </div>

            </div >
        )
    }
}

const mapStateToProps = state => ({
    users: state.entities.users.list,
    groups: state.entities.groups.list,
    currentGroup: state.entities.users.currentGroup,
    currentUser: userId => getCurrentUser(userId)(state),
    getGroup: groupname => getGroup(groupname)(state),
    getUser: email => getCurrentUserByEmail(email)(state)
})

const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(loadUsers()),
    loadGroups: () => dispatch(loadGroups()),
    addGift: (userId, gift, groupname) => dispatch(addGiftToUser(userId, gift, groupname)),
    removePersonFromPickPool: (person, groupname) => dispatch(removePersonFromPickPool(person, groupname)),
    assignPersonToUser: (user, person) => dispatch(assignPersonToUser(user, person)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SecretSanta));