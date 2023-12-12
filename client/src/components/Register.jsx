import React from 'react';
import Joi from 'joi-browser';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import Form from './common/form/Form';

import { getCurrentUserByEmail, loadUsers, registerUser } from '../store/users';
import { addUserToGroup, loadGroups } from '../store/groups';

class Register extends Form {
    state = {
        data: {
            firstname: 'Starrika',
            email: 'cybre3@gmail.com',
            password: '123456',
            repassword: '123456',
            role: '',
            group: ''
        },
        errors: {}
    }

    schema = {
        _id: Joi.string(),
        firstname: Joi.string().required().label('First Name'),
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().required().label('Passowrd'),
        repassword: Joi.string().required().label('Re-Passowrd'),
        role: Joi.string().required().label('Role'),
        group: Joi.string().required().label('Group Name')
    }

    inputClasses = {
        inputContainer: 'flex flex-col space-y-2 w-[75%]',
        inputClass: 'rounded-sm outline outline-1 pl-3 py-1 tx-sm w-full'
    }

    participantOptions = [
        { id: 1, name: 'role', value: 'Participant/Secret Santa' },
        { id: 2, name: 'role', value: 'Spectator/Watcher' },
    ];

    groupOptions = [
        { id: 1, name: 'group', value: 'Family Secret Santa 2023' }
    ];

    btnClass = 'cursor-pointer rounded border border-black my-4 mt-8  px-4 py-1 hover:bg-green-700 hover:text-white';

    doSubmit = async () => {
        const userEntry = this.state.data;
        try {
            await this.props.registerUser(userEntry);
            await this.props.addUserToGroup(userEntry);

            window.location = `/login`;
        } catch (error) {
            console.log(error.message)
        }
    }

    render() {
        return (
            <div className='w-screen h-screen overflow-hidden bg-green-800 flex items-center'>

                <form onSubmit={this.handleSubmit} className='mx-auto py-6 h-fit w-[25%] flex flex-col bg-neutral-50 rounded space-y-2 items-center border border-black border-2 shadow-md shadow-white p-4 py-8'>

                    <h2 className='text-2xl font-bold tracking-wider uppercase'>Register</h2>

                    {this.renderInput('firstname', 'First Name', '', '', this.inputClasses)}
                    {this.renderInput('email', 'Email', 'email', '', this.inputClasses)}
                    {this.renderInput('password', 'Password', 'password', '', this.inputClasses)}
                    {this.renderInput('repassword', 'Repeat Password', 'password', '', this.inputClasses)}
                    {this.renderDropdown('role', 'What is you role in Secret Santa?', this.participantOptions, this.inputClasses)}
                    {this.renderDropdown('group', 'Group', this.groupOptions, this.inputClasses)}

                    {this.renderButton('Register', '', '', this.btnClass)}

                    <p>Already a registered Secret Santa? Login
                        <NavLink to='/login' className='text-blue-700 ml-1'>
                            Here
                        </NavLink>
                        !
                    </p>
                </form>

            </div >
        )
    }
}

const mapStateToProps = state => ({
    groups: state.entities.groups,
    users: state.entities.users,
    getCurrentUserByEmail: email => getCurrentUserByEmail(email)(state)
});

const mapDispatchToProps = dispatch => ({
    loadUsers: () => dispatch(loadUsers()),
    loadGroups: () => dispatch(loadGroups()),
    registerUser: user => dispatch(registerUser(user)),
    addUserToGroup: user => dispatch(addUserToGroup(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);