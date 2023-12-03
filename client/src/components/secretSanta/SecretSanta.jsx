// secret santa name - DONE
// secret santa gift list - my list
// gift priority // sort function - sort by number
// person assignment
// access to person assigned gift list
// gift selection - DONE
// Render gift in list

import React from 'react';
import Joi from 'joi-browser';
import { connect } from 'react-redux';

import withRouter from '../../utilities/withRouter';
import { addGiftToUser, getCurrentUser, loadUsers } from '../../store/users';
import { getGroup, removePersonFromPickPool } from '../../store/groups';

import Form from '../common/form/Form';
import Lists from './ListToggle';

class SecretSanta extends Form {
    state = {
        data: {
            name: '',
            link: '',
            priority: 0
        },
        personToGift: {},
        user: {},
        errors: {}
    }

    componentDidMount() {
        this.props.loadUsers();
        const { id: userId } = this.props.params;
        const storeCurrentUser = this.props.currentUser(userId);
        const localStorageCurrentUser = getCurrentUser(userId);

        if (storeCurrentUser._id === localStorageCurrentUser._id)
            this.setState({ user: storeCurrentUser })
    }

    schema = {
        name: Joi.string().allow('').label('Gift Name'),
        link: Joi.string().allow('').label('Gift Link'),
        priority: Joi.string().allow('').label('Gift Priority'),
    }

    priorityOptions = [
        { id: 1, name: 'priority', value: 1 },
        { id: 2, name: 'priority', value: 2 },
        { id: 3, name: 'priority', value: 3 }
    ]

    inputClasses = {
        inputContainer: 'flex justify-between space-x-2 w-full',
        inputClass: 'rounded-sm outline outline-1 pl-3 py-1 tx-sm w-[70%]',
        labelClass: 'text-white'
    }

    dropdownClasses = {
        inputContainer: 'flex justify-between space-x-2 w-full',
        inputClass: 'rounded-sm outline outline-1 tx-sm w-[20%] text-center !mr-20',
        labelClass: 'text-white'
    }

    btnClass = 'cursor-pointer rounded border border-black my-4 px-4 py-1 hover:bg-green-700 hover:text-white bg-white';

    handleAssignPerson = () => {
        const { pickPool } = this.props.getGroup(this.state.user.group)
        const randomIndex = Math.random(pickPool.length * 1) - 1;
        const personToGift = pickPool[randomIndex];

        this.setState({ personToGift });
        this.props.removePerson(personToGift);
    }

    doSubmit = () => {
        this.props.addGift(this.props.params.id, this.state.data);
        this.setState({ data: { name: '', link: '', priority: 0 } });
    }

    render() {
        const { user, personToGift } = this.state;

        return (
            <div className='w-screen h-screen overflow-hidden bg-green-800 flex items-center'>

                <div className='mx-auto py-6 h-fit w-[50%] flex flex-col bg-neutral-50 rounded space-y-10 items-center border border-black border-2 shadow-md shadow-white'>

                    <div className='w-full flex justify-around mb-4'>
                        <h3>Secret Santa: {user.firstname}</h3>
                        <div className='flex space-x-4'>
                            {
                                !personToGift._id &&
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

                    <Lists title={'Lists'} />

                    <form name='add-to-gift-list' onSubmit={this.handleSubmit} className='w-[50%] border-2 border-black rounded p-4 bg-green-600'>

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
    currentUser: userId => getCurrentUser(userId)(state),
    getGroup: groupname => getGroup(groupname)(state)
})

const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(loadUsers()),
    addGift: (userId, gift) => dispatch(addGiftToUser(userId, gift)),
    removePerson: person => dispatch(removePersonFromPickPool(person))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SecretSanta));