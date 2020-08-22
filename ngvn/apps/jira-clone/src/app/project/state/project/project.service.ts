import { Injectable } from '@angular/core';
import {
  CreateIssueGQL,
  CreateIssueMutationVariables,
  FindProjectBySlugGQL,
  ProjectDto,
  ProjectIssueDto
} from '@trungk18/core/graphql/service/graphql';
import { JComment } from '@trungk18/interface/comment';
import { FetchResult } from 'apollo-link';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ProjectStore } from './project.store';
import { environment } from 'apps/jira-clone/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;

  constructor(
    private _store: ProjectStore,
    private _findProjectBySlug: FindProjectBySlugGQL,
    private _createIssue: CreateIssueGQL
  ) {
    this.baseUrl = environment.apiUrl;
  }

  setLoading(isLoading: boolean) {
    this._store.setLoading(isLoading);
  }

  getProject(slug: string): Observable<FetchResult> {
    this.setLoading(true);
    return this._findProjectBySlug
      .fetch({
        slug
      })
      .pipe(
        tap((res) => {
          let project: any = res.data.findProjectBySlug;
          this._store.update((state) => {
            let newState = {
              ...state,
              ...project
            };
            console.log(newState);
            return newState;
          });
        }),
        finalize(() => {
          this.setLoading(false);
        })
      );
  }

  updateProject(project: Partial<ProjectDto>) {
    this._store.update((state) => ({
      ...state,
      ...project
    }));
  }

  createIssue(issueInput: CreateIssueMutationVariables) {
    let input: CreateIssueMutationVariables = {
      ...issueInput,
      projectId: this._store.getValue().id
    };
    return this._createIssue.mutate(input).pipe(
      tap(({ data }) => {
        this._store.update({});
      })
    );
  }

  updateIssue(issue: ProjectIssueDto) {
    // issue.updatedAt = DateUtil.getNow();
    // this._store.update((state) => {
    //   let issues = arrayUpsert(state.issues, issue.id, issue);
    //   return {
    //     ...state,
    //     issues
    //   };
    // });
  }

  deleteIssue(issueId: string) {
    // this._store.update((state) => {
    //   let issues = arrayRemove(state.issues, issueId);
    //   return {
    //     ...state,
    //     issues
    //   };
    // });
  }

  updateIssueComment(issueId: string, comment: JComment) {
    // let allIssues = this._store.getValue().issues;
    // let issue = allIssues.find((x) => x.id === issueId);
    // if (!issue) {
    //   return;
    // }
    // let comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
    // this.updateIssue({
    //   ...issue,
    //   comments
    // });
  }
}
